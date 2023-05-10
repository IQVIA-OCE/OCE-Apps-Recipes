import { NAMESPACE } from '../../../constants';

export const mapTopics = topics =>
  topics.map(el => ({
    id: el['Id'],
    name: el['Name'],
    meetingType: el[`${NAMESPACE}MeetingType__c`],
    meetingRecordTypes: mapRecordType(el[`${NAMESPACE}MeetingRecordTypes__c`]),
    status: el[`${NAMESPACE}Status__c`],
    startDate: el[`${NAMESPACE}StartDate__c`],
    endDate: el[`${NAMESPACE}EndDate__c`],
    currencyIsoCode: el.CurrencyIsoCode,
  }));

export const mapRecordType = (recordType) => {
  if(recordType){
    const types = recordType.split(';');
    const convertTypes = types.map(type => convertRecordType(type));

    return convertTypes.join(';');
  }
};

export const convertRecordType = (type) => {
  switch (type) {
    case 'Rep_Presentation':
      return 'RepPresentation';
    case 'Displays_Exhibits':
      return 'Displays and Exhibits';
    case 'Speaker_Meeting':
      return 'Speaker Meeting';
    case 'HCP_Sponsorship':
      return 'HCP Sponsorship';
    default:
      return type;
  }
};

export const mapMeetingTopics = meetingTopics =>
  meetingTopics.map(el => ({
    ...el,
    id: el['Id'],
    topic: el[`${NAMESPACE}Topic__c`],
  }));

export const mapMeeting = m => ({
  id: m['Id'],
  name: m['Name'],
  recordTypeName: m['RecordType.Name'],
  recordTypeDevName: m['RecordType.DeveloperName'],
  startDate: m[`${NAMESPACE}StartDateTime__c`],
  endDate: m[`${NAMESPACE}EndDateTime__c`],
});
