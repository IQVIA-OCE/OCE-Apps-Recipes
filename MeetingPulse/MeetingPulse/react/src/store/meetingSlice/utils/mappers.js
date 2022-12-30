import { NAMESPACE } from '../../../constants/namespacePrefix';

export const mapMeeting = meeting => ({
  status: meeting[`${NAMESPACE}Status__c`],
  startDate: meeting[`${NAMESPACE}StartDateTime__c`],
  endDate: meeting[`${NAMESPACE}EndDateTime__c`],
  estimatedBudget: meeting[`${NAMESPACE}TotalEstimatedExpenses__c`],
  currencyISOCode: meeting['CurrencyIsoCode']
});
