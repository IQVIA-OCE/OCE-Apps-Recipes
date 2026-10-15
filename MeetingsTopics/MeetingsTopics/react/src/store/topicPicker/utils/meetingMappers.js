import { NAMESPACE } from '../../../constants';

export const mapMeeting = m => ({
  id: m['Id'],
  name: m['Name'],
  recordTypeName: m['RecordType.Name'],
  recordTypeDevName: m['RecordType.DeveloperName'],
  startDate: m[`${NAMESPACE}StartDateTime__c`],
  endDate: m[`${NAMESPACE}EndDateTime__c`],
});