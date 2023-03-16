import { NAMESPACE } from '../../../constants/namespacePrefix';

export const mapOutstandingSampleRequests = (list = []) => {
  let result = [];

  list.forEach((account) => {
    let accountIndex = result.findIndex((item) => account[`${NAMESPACE}Account__c`] === item.accountId);
    if (accountIndex === -1) {
      result.push({
        accountId: account[`${NAMESPACE}Account__c`],
        Name: account[`${NAMESPACE}Account__r.${NAMESPACE}AccountFullName__c`],
        callId: account[`${NAMESPACE}Call__c`],
        Id: account.Id,
        samples: [
          {
            quantity: account[`${NAMESPACE}Quantity__c`],
            name: account[`${NAMESPACE}Sample__r.Name`],
            Id: account[`${NAMESPACE}Sample__r.Id`],
          },
        ],
      });
    } else {
      result[accountIndex] = {
        ...result[accountIndex],
        samples: [
          ...result[accountIndex].samples,
          {
            quantity: account[`${NAMESPACE}Quantity__c`],
            name: account[`${NAMESPACE}Sample__r.Name`],
            Id: account[`${NAMESPACE}Sample__r.Id`],
          },
        ],
      };
    }
  });

  return result;
};

export const getAttendeesIds = (list) => {
  let ids = [];

  Object.keys(list).forEach((key) => list[key].map((item) => item.customerId && ids.push(item.customerId)));

  return ids;
};
