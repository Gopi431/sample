# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/nvme0n1p2 during installation
UUID=1f5ab9ec-c551-4a5e-b580-588a3e507050 /               ext4    errors=remount-ro 0       1
# /boot/efi was on /dev/nvme0n1p1 during installation
/swapfile                                 none            swap    sw              0       0
UUID=1f5ab9ec-c551-4a5e-b580-588a3e507050  /mnt/windows  ntfs-3g  defaults,force  0  0
UUID=0BF75F8344BBB4D4 /media/gopiganisetti/0BF75F8344BBB4D4 auto nosuid,nodev,nofail,x-gvfs-show 0 0
