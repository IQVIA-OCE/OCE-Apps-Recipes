import { normalizeOrderDeliveries, extractBrandsOptions } from './utils';
import { environment } from 'oce-apps-bridges';

const productDetails = [
  {
    Id: 'a3v6g000000Pv0xAAC',
    Name: 'ODTL-1300',
    OCE__Account__c: '0016g00000awb1yAAA',
    OCE__Free__c: 48,
    OCE__OrderDelivery2__c: 'a3u6g0000006JSoAAM',
    'OCE__OrderDelivery2__r.OCE__DeliveryDate__c': '2020-09-03',
    OCE__OrderLineItem2__c: 'a3y6g000000HVefAAG',
    OCE__ProductName__c: null,
    'OCE__Product__r.Name': null,
    OCE__Product__c: 'a4J6g000000gHEaEAM',
    'OCE__Product__r.OCE__ProductCode__c': 'SOR00005',
    OCE__Quantity__c: null,
    uid: 'a3v6g000000Pv0xAAC',
    'OCE__Product__r.OCE__ParentBrandProductId__c': null,
    'OCE__Product__r.OCE__ParentBrandProductId__r.Name': null
  },
  {
    Id: 'a3v6g000000Pv0wAAC',
    Name: 'ODTL-1299',
    OCE__Account__c: '0016g00000awb1yAAA',
    OCE__Free__c: 48,
    OCE__OrderDelivery2__c: 'a3u6g0000006JSoAAM',
    'OCE__OrderDelivery2__r.OCE__DeliveryDate__c': '2020-09-03',
    OCE__OrderLineItem2__c: 'a3y6g000000HVehAAG',
    OCE__ProductName__c: null,
    'OCE__Product__r.Name': null,
    OCE__Product__c: 'a4J6g000000gHE9EAM',
    'OCE__Product__r.OCE__ProductCode__c': '1244',
    OCE__Quantity__c: null,
    uid: 'a3v6g000000Pv0wAAC',
    'OCE__Product__r.OCE__ParentBrandProductId__c': null,
    'OCE__Product__r.OCE__ParentBrandProductId__r.Name': null
  },
  {
    Id: 'a3v6g000000Pv0vAAC',
    Name: 'ODTL-1298',
    OCE__Account__c: '0016g00000awb1yAAA',
    OCE__Free__c: 48,
    OCE__OrderDelivery2__c: 'a3u6g0000006JSoAAM',
    'OCE__OrderDelivery2__r.OCE__DeliveryDate__c': '2020-09-03',
    OCE__OrderLineItem2__c: 'a3y6g000000HVedAAG',
    OCE__ProductName__c: null,
    'OCE__Product__r.Name': null,
    OCE__Product__c: 'a4J6g000000gHEcEAM',
    'OCE__Product__r.OCE__ProductCode__c': 'SOR00007',
    OCE__Quantity__c: null,
    uid: 'a3v6g000000Pv0vAAC',
    'OCE__Product__r.OCE__ParentBrandProductId__c': null,
    'OCE__Product__r.OCE__ParentBrandProductId__r.Name': null
  },
];

const expectedResult = [
  {
    productdId: 'a4J6g000000gHEaEAM',
    productName: null,
    productCode: 'SOR00005',
    deliveries: [
      { id: 'a3u6g0000006JSoAAM', date: '2020-09-03', quantity: 48 },
    ],
    totalProductQuantity: 48,
    parentBrandProduct: {
      id: null,
      label: null,
    },
  },
  {
    productdId: 'a4J6g000000gHE9EAM',
    productName: null,
    productCode: '1244',
    deliveries: [
      { id: 'a3u6g0000006JSoAAM', date: '2020-09-03', quantity: 48 },
    ],
    totalProductQuantity: 48,
    parentBrandProduct: {
      id: null,
      label: null,
    },
  },
  {
    productdId: 'a4J6g000000gHEcEAM',
    productName: null,
    productCode: 'SOR00007',
    deliveries: [
      { id: 'a3u6g0000006JSoAAM', date: '2020-09-03', quantity: 48 },
    ],
    totalProductQuantity: 48,
    parentBrandProduct: {
      id: null,
      label: null,
    },
  },
];

const normalizeData = [
  {
    productdId: 'a4J6g000000gHEaEAM',
    productName: null,
    productCode: 'SOR00005',
    deliveries: [
      { id: 'a3u6g0000006JSoAAM', date: '2020-09-03', quantity: 48 },
    ],
    totalProductQuantity: 48,
    parentBrandProduct: {
      id: '123',
      label: 'PLOMAX',
    },
  }
];

const expectedExtractedOptions = [
  {
    value: '123',
    label: 'PLOMAX',
  }
]

describe('normalize product details', () => {
  it('should return normalized data', () => {
    environment.namespace = jest.fn().mockReturnValue('OCE__');
    const normalized = normalizeOrderDeliveries(productDetails);

    expect(normalized).toStrictEqual(expectedResult);
  });
  it('should return extracted options', () => {
    environment.namespace = jest.fn().mockReturnValue('OCE__');
    const extractedOptions = extractBrandsOptions(normalizeData);

    expect(extractedOptions).toStrictEqual(expectedExtractedOptions);
  });
});
