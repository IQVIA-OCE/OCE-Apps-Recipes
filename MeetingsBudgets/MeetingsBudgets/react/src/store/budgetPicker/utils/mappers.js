import { NAMESPACE } from '../../../constants';

export const mapBudgets = (budgets) =>
  budgets.map((elem) => ({
    id: elem['Id'],
    name: elem['Name'] || '',
    childrenAllocatedAmount: elem[`${NAMESPACE}ChildrenAllocatedAmount__c`],
    currencyISOCode: elem['CurrencyIsoCode'] || '',
    actualAmount: elem[`${NAMESPACE}ActualAmount__c`],
    consumptionBudget: elem[`${NAMESPACE}ConsumptionBudget__c`],
    endDate: elem[`${NAMESPACE}EndDate__c`] || '',
    estimatedAmount: elem[`${NAMESPACE}EstimatedAmount__c`],
    meetingType: elem[`${NAMESPACE}MeetingType__c`] || '',
    remaining: elem[`${NAMESPACE}Remaining__c`],
    startDate: elem[`${NAMESPACE}StartDate__c`] || '',
    status: elem[`${NAMESPACE}Status__c`] || '',
    totalAmount: elem[`${NAMESPACE}TotalAmount__c`],
  }));

export const mapMeeting = (meeting) => ({
  id: meeting['Id'],
  name: meeting['Name'],
  recordTypeName: meeting['RecordType.Name'],
  recordTypeDevName: meeting['RecordType.DeveloperName'],
  startDate: meeting[`${NAMESPACE}StartDateTime__c`],
  endDate: meeting[`${NAMESPACE}EndDateTime__c`],
});
