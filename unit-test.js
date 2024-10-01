'use strict';

const Lab = require('lab');
const addison = require('./lib/addison');
const Code = require('code');
const expect = Code.expect;
const nock = require('nock');
const read_data = require('../test/reading-data'); // eslint-disable-line

const lab = exports.lab = Lab.script();
const before = lab.before;
const proxyquire = require('proxyquire').noPreserveCache();

let server = null; // eslint-disable-line
lab.experiment('Tests for get', () => {
  before(done => {
    addison.getServer()
      .then(addisonServer => {
        server = addisonServer;
        done();
      });
  });


  lab.test('Unit Test case for primaryinfo calling S4', done => {
    const getprimaryinfohandler = proxyquire(`${process.cwd()}/src/api/get-primaryinfo/get-primaryinfo-handlers`, {});
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_GET_PRIMARY_INFO_SRV_ODS_SRV/ETY_PRIMARY_INFO_REQSet?sap-client=300')
      .reply(201, {}, {
        'x-csrf-token ': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      });
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_GET_PRIMARY_INFO_SRV_ODS_SRV/ETY_PRIMARY_INFO_REQSet?sap-client=300')
      .reply(201, read_data.getPrimaryInfoResS4);
    const fakes = {
      payload: '',
    };
    getprimaryinfohandler.getPrimaryInfo(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for primaryinfo calling SNR', done => {
    const getprimaryinfohandler = proxyquire(`${process.cwd()}/src/api/get-primaryinfo/get-primaryinfo-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.getPrimaryInfoReqSNR,
    };
    getprimaryinfohandler.getPrimaryInfo(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ATNGetPrimaryInfoResponse.ATNheader.description).to.equal('Transaction completed successfully-Data is from SNR');
      return done();
    });
  });


  lab.test('Unit Test case for productList calling S4', done => {
    const getproductlisthandler = proxyquire(`${process.cwd()}/src/api/get-productlist/get-productlist-handlers`, {});
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_GET_PROD_LIST_SRV_ODS_SRV/ETY_GET_PRODUCT_NOSet?sap-client=300')
      .reply(201, {}, {
        'x-csrf-token ': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      });
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_GET_PROD_LIST_SRV_ODS_SRV/ETY_GET_PRODUCT_NOSet?sap-client=300')
      .reply(201, read_data.getProductListResS4);
    const fakes = {
      payload: ' ',
    };
    getproductlisthandler.getProductList(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for productList calling SNR', done => {
    const getproductlisthandler = proxyquire(`${process.cwd()}/src/api/get-productlist/get-productlist-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.getProductListReqSnr,
    };
    getproductlisthandler.getProductList(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ATNheader.description).to.equal('Transaction completed successfully-Data is from SNR');
      return done();
    });
  });

  lab.test('Unit Test case for getserialinfomib calling S4', done => {
    const getserialinfomibhandler = proxyquire(`${process.cwd()}/src/api/get-serialinfo-mib/get-serialinfo-mib-handlers`, {});
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_GET_SERIAL_INFO_SRV_ODS_SRV_01/ETS_SERIAL_INFO?sap-client=300')
      .reply(201, {}, {
        'x-csrf-token ': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      });
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_GET_SERIAL_INFO_SRV_ODS_SRV_01/ETS_SERIAL_INFO?sap-client=300')
      .reply(201, read_data.getSerialInfoMibResS4);
    const fakes = {
      payload: ' ',
    };
    getserialinfomibhandler.getSerialInfoMIB(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for getserialinfomib calling SNR', done => {
    const getserialinfomibhandler = proxyquire(`${process.cwd()}/src/api/get-serialinfo-mib/get-serialinfo-mib-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.getSerialInfoMibReqSnr,
    };
    getserialinfomibhandler.getSerialInfoMIB(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ATNheader.description).to.equal('Transaction completed successfully-Data is from SNR');
      return done();
    });
  });

  lab.test('Unit Test case for validate-part-to-product calling S4', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/validate-part-toproduct/vadidate-part-toproduct-handlers`, {});
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_VALID_PART_TO_PROD_SRV_ODS_SRV/ETS_HEADER?sap-client=300')
      .reply(201, '{}', {
        'x-csrf-token': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      }
      );

    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_VALID_PART_TO_PROD_SRV_ODS_SRV/ETS_HEADER?sap-client=300')
      .reply(201, read_data.validateParttoProductS4Res);

    const fakes = {
      payload: '',
    };
    handler.validatePartToProduct(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for validate-part-to-product calling SNR', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/validate-part-toproduct/vadidate-part-toproduct-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.validateParttoProductSNRReq,
    };
    handler.validatePartToProduct(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ErrorDescription).to.equal('Transaction completed successfully-Data is from SNR');
      return done();
    });
  });

  lab.test('Unit Test case for validate-part-to-product validateS4Response partial Data', done => {
    const handler = proxyquire(`${process.cwd()}/src/adapters/util`, {});
    handler.validateS4Response(read_data.validateParttoProductS4ResPartialData, 'I-99999')
      .catch(err => done());
  });

  lab.test('Unit Test case for getProductHierarchy calling S4', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/get-product-hierarchy/get-product-hierarchy-handlers`, {});
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_GET_PRODUCT_HIERARCHY_SRV/ETY_GET_PRODUCT_HIER_REQSet?sap-client=300')
      .reply(201, '{}', {
        'x-csrf-token': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      }
      );

    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_GET_PRODUCT_HIERARCHY_SRV/ETY_GET_PRODUCT_HIER_REQSet?sap-client=300')
      .reply(201, read_data.getProductHierarchyResS4);

    const fakes = {
      payload: '',
    };
    handler.getProductHierarchy(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for getProductHierarchy request for SNR data Found', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/get-product-hierarchy/get-product-hierarchy-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.getProductHierarchyReqSNR,
    };
    handler.getProductHierarchy(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ATNGetProductHierarchyResponse.ATNheader.description).to.equal('Transaction completed successfully-Data is from SNR');
      return done();
    });
  });

  lab.test('Unit Test case for getSerialInfoLegacy  calling S4', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/get-serialinfo-legacy/get-serialinfo-legacy-handlers`, {});

    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_GET_SERIAL_INFO_LEG_SRV_ODS_SRV/ETS_SERIAL_INFO?sap-client=300')
      .reply(201, '{}', {
        'x-csrf-token': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      }
      );

    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_GET_SERIAL_INFO_LEG_SRV_ODS_SRV/ETS_SERIAL_INFO?sap-client=300')
      .reply(201, read_data.getSerialInfoLegacyS4Res);

    const fakes = {
      payload: '',
    };
    handler.getSerialInfoLegacy(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for getSerialInfoLegacy calling Snr', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/get-serialinfo-legacy/get-serialinfo-legacy-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.getSerialInfoLegacySNRReq,
    };
    handler.getSerialInfoLegacy(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ATNGetSerialInfoResponse.ATNheader.code).to.equal('E-0000');
      return done();
    });
  });

  lab.test('Unit Test case for isSerialNumber-exists calling S4', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/is-serialnumberexist/is-serialnumberexist-handlers`, {});

    nock(' https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_SERIALNUMBER_EXISTS_SRV_ODS_SRV/ETY_SERNOEXISTSet?sap-client=300')
      .reply(201, '{}', {
        'x-csrf-token': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      }
      );

    nock(' https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_SERIALNUMBER_EXISTS_SRV_ODS_SRV/ETY_SERNOEXISTSet?sap-client=300')
      .reply(201, read_data.isSerialNumberExistsS4Res);

    const fakes = {
      payload: '',
    };
    handler.isSerialNumberExist(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for isSerialNumber-exists calling Snr', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/is-serialnumberexist/is-serialnumberexist-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.isSerialNumberExistsSnrReq,
    };
    handler.isSerialNumberExist(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ErrorDescription).to.equal('Transaction completed successfully-Data is from SNR');
      return done();
    });
  });


  lab.test('Unit Test case for manufacturingComponentValidation calling S4', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/manufacturing-component-validation/manufacturing-component-validation-handlers`, {});
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_MANUF_COMP_VAL_SRV_ODS_SRV/ETS_HEADER?sap-client=300')
      .reply(201, '{}', {
        'x-csrf-token': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      }
      );

    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_MANUF_COMP_VAL_SRV_ODS_SRV/ETS_HEADER?sap-client=300')
      .reply(201, read_data.manufacturingComponentValidationS4Res);

    const fakes = {
      payload: '',
    };
    handler.manufacturingComponentValidation(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });


  lab.test('Unit Test case for getManufacturingBillOfMaterial request for s4 data Found with nock', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/get-manufacturingbillofmaterial/get-manufacturingbillofmaterial-handlers`, {});
    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .get('/sap/opu/odata/SAP/Z_GET_MANUF_BOM_SRV_ODS_SRV/ETY_MANUF_BOM_REQSet?sap-client=300')
      .reply(201, '{}', {
        'x-csrf-token': 'b4mMC1LVqnWFNyU9HP-n6Q==',
        'Set-Cookie': ['sap-usercontext=sap-client=300; path=/',
          'SAP_SESSIONID_DVN_300=FpkvcO7h5NiLkcYZUuNjUiwG2q3huxHoltMA_UVNzUg%3d; path=/'],
      }
      );

    nock('https://cs900r01os8.rose.sc.hpecorp.net:44321', { encodedQueryParams: true })
      .post('/sap/opu/odata/SAP/Z_GET_MANUF_BOM_SRV_ODS_SRV/ETY_MANUF_BOM_REQSet?sap-client=300')
      .reply(201, read_data.getManufacturingBillOfMaterialS4Res);

    const fakes = {
      payload: '',
    };
    handler.getManufacturingBillOfMaterial(fakes, resp => {
      expect(resp).to.exist();
      return done();
    });
  });

  lab.test('Unit Test case for getManufacturingBillOfMaterial calling Snr', done => {
    const handler = proxyquire(`${process.cwd()}/src/api/get-manufacturingbillofmaterial/get-manufacturingbillofmaterial-handlers`, {});
    nock.cleanAll();
    const fakes = {
      payload: read_data.getManufacturingBillOfMaterialSNRReq,
    };
    handler.getManufacturingBillOfMaterial(fakes, resp => {
      expect(resp).to.exist();
      expect(resp.d.ErrorDescription).to.equal('Transaction completed successfully-Data is from SNR');
      return done();
    });
  });
});// experiment end











