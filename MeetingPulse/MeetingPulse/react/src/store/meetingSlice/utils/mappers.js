import { NAMESPACE } from '../../../constants/namespacePrefix';

export const mapMeeting = (meeting) => ({
  status: meeting[`${NAMESPACE}Status__c`],
  startDate: meeting[`${NAMESPACE}StartDateTime__c`],
  endDate: meeting[`${NAMESPACE}EndDateTime__c`],
  estimatedBudget: meeting.estimatedBudget,
  currencyISOCode: meeting['CurrencyIsoCode'],
});
