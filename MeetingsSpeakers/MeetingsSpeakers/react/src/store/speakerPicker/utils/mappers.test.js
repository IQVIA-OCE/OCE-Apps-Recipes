import { NAMESPACE } from '../../../constants/namespacePrefix';
import { mapMeeting, mapMeetingMembers, mapRecordType, mapSpeakers } from './mappers';

describe('store mappers', () => {
  it('mapSpeakers', () => {
    const speakers = [
      {
        Id: '1',
        Name: 'speaker 1',
        [`${NAMESPACE}Account__c`]: 'test account',
        [`${NAMESPACE}Specialty__c`]: 'test speciality',
        [`${NAMESPACE}ProfessionalDesignation__c`]: 'test professional designation',
        [`${NAMESPACE}Status__c`]: 'test status',
        [`${NAMESPACE}User__c`]: 'test user',
        [`${NAMESPACE}Account__r.${NAMESPACE}AllowRestrictedProducts__c`]: null,
        [`${NAMESPACE}Account__r.Id`]: '2',
      },
    ];

    expect(mapSpeakers(speakers)).toStrictEqual([
      {
        id: '1',
        name: 'speaker 1',
        account: 'test account',
        specialty: 'test speciality',
        professionalDesignation: 'test professional designation',
        status: 'test status',
        user: 'test user',
        allowRestrictedProducts: null,
        accountId: '2',
      },
    ]);
  });

  it('mapMeeting', () => {
    const meeting = {
      Id: '1',
      [`${NAMESPACE}ContextUserRole__c`]: 'test',
    };

    expect(mapMeeting(meeting)).toStrictEqual({
      id: '1',
      [`${NAMESPACE}ContextUserRole__c`]: 'test',
    });
  });

  it('mapRecordType', () => {
    const recordType = {
      Id: '1',
    };

    expect(mapRecordType(recordType)).toStrictEqual({
      id: '1',
    });
  });

  it('mapMeetingMembers', () => {
    const members = [
      {
        Id: '1',
        Name: 'test name',
        [`${NAMESPACE}Speaker__c`]: 'test speaker',
      },
    ];

    expect(mapMeetingMembers(members)).toStrictEqual([
      {
        Id: '1',
        Name: 'test name',
        [`${NAMESPACE}Speaker__c`]: 'test speaker',
        id: '1',
        name: 'test name',
        speaker: 'test speaker',
      },
    ]);
  });
});
