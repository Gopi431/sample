[CmdletBinding()]
param(
    # Supplied as runbook parameters, or from environment variables / app settings on the host.
    [string]$SubscriptionId = $env:D4IOT_SUBSCRIPTION_ID,
    [string]$StorageAccount = $env:D4IOT_STORAGE_ACCOUNT,
    [string]$ContainerName  = $env:D4IOT_CONTAINER_NAME
)

$ErrorActionPreference = "Stop"
Import-Module Az.Accounts, Az.Storage

# --------------- Configuration ---------------
$PageSize = 1000  # Resource Graph maximum per call
$Columns  = @('id', 'name', 'deviceType', 'vendor', 'os', 'ip', 'mac')

# --------------- Validate configuration ---------------
# Validation attributes in param() are not applied to default values, so validate explicitly.
if ($SubscriptionId -notmatch '^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$') {
    throw "Configuration error: SubscriptionId is missing or is not a valid GUID."
}
if ($StorageAccount -cnotmatch '^[a-z0-9]{3,24}$') {
    throw "Configuration error: StorageAccount is missing or is not a valid storage account name."
}
if ($ContainerName -cnotmatch '^(?!.*--)[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$') {
    throw "Configuration error: ContainerName is missing or is not a valid container name."
}

# Spreadsheet apps execute cells starting with = + - @ (or tab/CR/LF and their full-width
# variants) as formulas; a leading apostrophe forces the cell to be treated as text.
function ConvertTo-CsvSafeValue {
    param([AllowNull()][object]$Value)

    $Text = [string]$Value
    if ($Text -match '^[=+\-@\t\r\n\uFF1D\uFF0B\uFF0D\uFF20]') {
        return "'" + $Text
    }
    return $Text
}

try {
    # --------------- Authenticate ---------------
    Connect-AzAccount -Identity | Out-Null
    Set-AzContext -SubscriptionId $SubscriptionId | Out-Null
    Write-Output "Connected with managed identity."
    Write-Verbose "Target subscription: $SubscriptionId"

    # --------------- Query device inventory ---------------
    # Single-quoted here-string: the query is a literal and nothing can be interpolated into it.
    $Query = @'
iotsecurityresources
| where type == 'microsoft.iotsecurity/locations/devicegroups/devices'
| project id,
          name,
          deviceType = tostring(properties.deviceType),
          vendor     = tostring(properties.vendor),
          os         = tostring(properties.operatingSystem),
          ip         = tostring(properties.ipAddress),
          mac        = tostring(properties.macAddress)
| order by id asc
'@

    # Resource Graph REST API (avoids the Az.ResourceGraph module dependency)
    $ApiPath   = "/providers/Microsoft.ResourceGraph/resources?api-version=2022-10-01"
    $Devices   = [System.Collections.Generic.List[object]]::new()
    $SkipToken = $null

    do {
        $Options = @{ '$top' = $PageSize; resultFormat = 'objectArray' }
        if ($SkipToken) { $Options['$skipToken'] = $SkipToken }

        $Body = @{
            subscriptions = @($SubscriptionId)
            query         = $Query
            options       = $Options
        } | ConvertTo-Json -Depth 5

        $Response = Invoke-AzRestMethod -Method POST -Path $ApiPath -Payload $Body
        if ($Response.StatusCode -ne 200) {
            Write-Verbose "Resource Graph error response: $($Response.Content)"
            throw "Resource Graph query failed with HTTP status $($Response.StatusCode)."
        }

        $Result = $Response.Content | ConvertFrom-Json
        foreach ($Row in $Result.data) {
            $SafeRow = [ordered]@{}
            foreach ($Column in $Columns) {
                $SafeRow[$Column] = ConvertTo-CsvSafeValue -Value $Row.$Column
            }
            $Devices.Add([pscustomobject]$SafeRow)
        }
        $SkipToken = $Result.'$skipToken'
    } while ($SkipToken)

    Write-Output "Retrieved $($Devices.Count) devices"

    # --------------- Build CSV in a temp file ---------------
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BlobName  = "d4iot_$Timestamp.csv"
    $TempFile  = Join-Path ([System.IO.Path]::GetTempPath()) $BlobName

    if ($Devices.Count -gt 0) {
        $Devices |
            Export-Csv -Path $TempFile -NoTypeInformation -Encoding UTF8
    }
    else {
        # No devices: write a header-only CSV so the export still lands in blob storage
        Write-Output "No devices returned. Uploading header-only CSV."
        $HeaderLine = ($Columns | ForEach-Object { '"' + $_ + '"' }) -join ','
        Set-Content -Path $TempFile -Value $HeaderLine -Encoding UTF8
    }

    # --------------- Upload to Blob Storage ---------------
    $StorageContext = New-AzStorageContext -StorageAccountName $StorageAccount -UseConnectedAccount

    Set-AzStorageBlobContent -Context    $StorageContext `
                             -Container  $ContainerName `
                             -File       $TempFile `
                             -Blob       $BlobName `
                             -Properties @{ ContentType = "text/csv" } `
                             -Force | Out-Null

    Write-Output "SUCCESS: Device inventory exported to $ContainerName/$BlobName"
}
catch {
    Write-Verbose "Failure detail: $($_.Exception.Message)"
    Write-Verbose "Failure location: $($_.ScriptStackTrace)"
    throw "FAILED: Device inventory export did not complete"
}
finally {
    if ($TempFile -and (Test-Path $TempFile)) {
        Remove-Item $TempFile -Force -ErrorAction SilentlyContinue
    }
}
