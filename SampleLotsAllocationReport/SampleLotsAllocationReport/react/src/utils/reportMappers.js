import { NAMESPACE } from '../constants';


export const mapReport = (reports) => {
  let formattedLots = [];
  reports.forEach((l) => {
    let obj = {};
    const index = formattedLots.findIndex((nl) => nl.productId === l[`${NAMESPACE}LotProductId__c`]);
    if (index > -1) {
      formattedLots[index]['childRows'] = [...formattedLots[index]['childRows'], {
        reportId: l.Id || '',
        lotName: l[`${NAMESPACE}Lot__r`]['Name'] || '',
        allocatedQuantity: l[`${NAMESPACE}AllocatedQuantity__c`],
        remainingQuantity: l[`${NAMESPACE}RemainingQuantity__c`]
      }]
      return;
    }
    obj['productId'] = l[`${NAMESPACE}LotProductId__c`];
    obj['productName'] = l[`${NAMESPACE}Lot__r`][`${NAMESPACE}Product__r`]['Name'];
    obj['childRows'] = [
      {
        reportId: l.Id || '',
        lotName: l[`${NAMESPACE}Lot__r`]['Name'] || '',
        allocatedQuantity: l[`${NAMESPACE}AllocatedQuantity__c`],
        remainingQuantity: l[`${NAMESPACE}RemainingQuantity__c`],
      }];
    obj['isGrouped'] = true;
    formattedLots.push(obj);
  });
  return formattedLots;
}



export const mapDtpRecord = (dtpReports) => {
  let formattedDtpRecords = [];
  dtpReports.forEach((l) => {
    let obj = {};
    const index = formattedDtpRecords.findIndex((nl) => nl.productId === l[`${NAMESPACE}Product__r`][`${NAMESPACE}ParentProduct__c`]);
    if (index > -1) {
      formattedDtpRecords[index]['childRows'] = [...formattedDtpRecords[index]['childRows'], {
        id: l[`${NAMESPACE}Product__c`],
        product: l[`${NAMESPACE}Product__r`]['Name'] || '',
        planCycle: l[`${NAMESPACE}PlanCycle__r`]['Name'] ? l[`${NAMESPACE}PlanCycle__r`]['Name'] : '',
        allocatedQuantity: l[`${NAMESPACE}AllocatedQuantity__c`] || 0,
        startDate: l[`${NAMESPACE}PlanCycle__r`]['Period__r'] ? l[`${NAMESPACE}PlanCycle__r`][`${NAMESPACE}Period__r`][`${NAMESPACE}StartDate__c`] : '',
        endDate: l[`${NAMESPACE}PlanCycle__r`]['Period__r'] ? l[`${NAMESPACE}PlanCycle__r`][`${NAMESPACE}Period__r`][`${NAMESPACE}EndDate__c`] : '',
        maxLimitPerCall: l[`${NAMESPACE}MaxLimitPerCall__c`] || 0,
        allocationsUsed: l[`${NAMESPACE}AllocationsUsed__c`] || 0,
        allocationsRemaining: l[`${NAMESPACE}AllocationsRemaining__c`] || 0,
      }]
      return;
    }
    obj['productId'] = l[`${NAMESPACE}Product__r`][`${NAMESPACE}ParentProduct__c`];
    obj['productName'] = l[`${NAMESPACE}Product__r`][`${NAMESPACE}ParentProduct__r`]['Name'];
    obj['childRows'] = [
      {
        id: l[`${NAMESPACE}Product__c`],
        product: l[`${NAMESPACE}Product__r`]['Name'] || '',
        planCycle: l[`${NAMESPACE}PlanCycle__r`]['Name'] ? l[`${NAMESPACE}PlanCycle__r`]['Name'] : '',
        allocatedQuantity: l[`${NAMESPACE}AllocatedQuantity__c`] || 0,
        startDate: l[`${NAMESPACE}PlanCycle__r`]['Period__r'] ? l[`${NAMESPACE}PlanCycle__r`][`${NAMESPACE}Period__r`][`${NAMESPACE}StartDate__c`] : '',
        endDate: l[`${NAMESPACE}PlanCycle__r`]['Period__r'] ? l[`${NAMESPACE}PlanCycle__r`][`${NAMESPACE}Period__r`][`${NAMESPACE}EndDate__c`] : '',
        maxLimitPerCall: l[`${NAMESPACE}MaxLimitPerCall__c`] || 0,
        allocationsUsed: l[`${NAMESPACE}AllocationsUsed__c`] || 0,
        allocationsRemaining: l[`${NAMESPACE}AllocationsRemaining__c`] || 0,
      }];
    obj['isGrouped'] = true;
    formattedDtpRecords.push(obj);
  });
  return formattedDtpRecords;
}


export const mapTransaction = (transaction) =>
  transaction.map((el) => {
    return {
      recordType: el[`${NAMESPACE}SampleTransaction__r`]['RecordType']['DeveloperName'] || '',
      transactionDate: {
        type: 'date',
        value: el[`${NAMESPACE}SampleTransaction__r`][`${NAMESPACE}TransactionDateTime__c`] || '',
      },
      status: el[`${NAMESPACE}SampleTransaction__r`][`${NAMESPACE}Status__c`] || '',
      call: {
        sObject: `${NAMESPACE}Call__c`,
        value: el[`${NAMESPACE}SampleTransaction__r`][`${NAMESPACE}Call__c`] || '',
        name: el[`${NAMESPACE}SampleTransaction__r`][`${NAMESPACE}Call__r`] ? el[`${NAMESPACE}SampleTransaction__r`][`${NAMESPACE}Call__r`]['Name'] : ''
      },
      callSample: el[`${NAMESPACE}CallSample__r`] ? el[`${NAMESPACE}CallSample__r`][`Name`] : '',
      product: {
        sObject: `${NAMESPACE}Product__c`,
        value: el[`${NAMESPACE}Product__c`] || '',
        name: el[`${NAMESPACE}Product__r`] ? el[`${NAMESPACE}Product__r`][`Name`] : ''
      },
      quantity: el[`${NAMESPACE}Quantity__c`] || '',
    }
  });

export const mapDtpAllocationDetails = (details) =>
  details.map((el) => {
    return {
      product: {
        sObject: (el[`${NAMESPACE}Product__r`] && el[`${NAMESPACE}Product__r`][`attributes`]) ? el[`${NAMESPACE}Product__r`][`attributes`]['type'] : '',
        value: el[`${NAMESPACE}Product__c`] || '',
        name: el[`${NAMESPACE}Product__r`] ? el[`${NAMESPACE}Product__r`][`Name`] : ''
      },
      callAccount: {
        sObject: (el[`${NAMESPACE}Call__r`] && el[`${NAMESPACE}Call__r`][`${NAMESPACE}Account__r`]) ? el[`${NAMESPACE}Call__r`][`${NAMESPACE}Account__r`][`attributes`]['type'] : '',
        value: el[`${NAMESPACE}Call__r`] ? el[`${NAMESPACE}Call__r`][`${NAMESPACE}Account__c`] : '',
        name: el[`${NAMESPACE}Call__r`] ? el[`${NAMESPACE}Call__r`][`${NAMESPACE}Account__r`]['Name'] : ''
      },
      date: {
        type: 'date',
        value: el[`${NAMESPACE}Call__r`] ? el[`${NAMESPACE}Call__r`][`${NAMESPACE}Date__c`] : '',
      },
      status: el[`${NAMESPACE}Call__r`] ? el[`${NAMESPACE}Call__r`][`${NAMESPACE}Status__c`] : '',
      quantity: el[`${NAMESPACE}Quantity__c`] || '',
      quantityShipped: el[`${NAMESPACE}QuantityShipped__c`] || '',
      dateShipped: el[`${NAMESPACE}DateShipped__c`] || '',
      finalQuantity: el[`${NAMESPACE}FinalQuantity__c`] || '',
      sample: el[`${NAMESPACE}Sample__r`] ? el[`${NAMESPACE}Sample__r`]['Name'] : '',
      sampleOrderAccount: {
        sObject: [`${NAMESPACE}Account__r`][`attributes`] ? [`${NAMESPACE}Account__r`][`attributes`]['type'] : '',
        value: el[`${NAMESPACE}Account__c`] || '',
        name: el[`${NAMESPACE}Account__r`] ? el[`${NAMESPACE}Account__r`]['Name'] : ''
      },

    }
  });

