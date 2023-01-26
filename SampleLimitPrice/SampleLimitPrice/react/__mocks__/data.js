import { NAMESPACE } from '../src/constants';

export const PRODUCTS_RESPONSE = {
  records: [
    {
      [`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`]:
        "0016s00000OYmXsAAL",
      [`${NAMESPACE}limitData__c`]:
        '{"Products":{"a4J6g000000gK7cEAE":{"repLimit":5,"remaining":1,"quota":9,"name":"Azelastine100MG","managerLimit":4,"hqLimit":4,"disbursed":8}}}',
      "recordtype.name": "Limit",
    },
    {
      [`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`]:
        "0016s00000OWYcSAAX",
      [`${NAMESPACE}limitData__c`]: null,
      "recordtype.name": "Limit",
    },
  ],
};

export const ACCOUNTS_RESPONSE = {
  records: [
    {
      Id: "0016s00000OYmXsAAL",
      [`${NAMESPACE}AccountFullname__c`]: "Will Denzer",
      uid: "0016s00000OYmXsAAL",
    },
    {
      Id: "11111111111111111",
      [`${NAMESPACE}AccountFullname__c`]: "John Doe",
      uid: "11111111111111111",
    },
  ],
};
