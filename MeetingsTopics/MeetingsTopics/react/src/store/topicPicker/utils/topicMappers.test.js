import { NAMESPACE } from '../../../constants/namespacePrefix';
import { mapTopics, convertRecordType, mapMeetingTopics, mapRecordType } from './topicMappers';

describe('mapTopics', () => {
    it('return mapTopics', () => {
        const topics = [
            {
                Id: '1',
                Name: 'meeting topic 1',
                [`${NAMESPACE}MeetingType__c`]: 'Speakers Meeting',
                [`${NAMESPACE}MeetingRecordTypes__c`]: 'Displays_Exhibits',
                [`${NAMESPACE}Status__c`]: 'approved',
                [`${NAMESPACE}StartDate__c`]: '2021-07-07T12:07:34.000+0000',
                [`${NAMESPACE}EndDate__c`]: '2021-07-07T12:07:34.000+0000',
                CurrencyIsoCode: 'currencyIsoCode',
            },
        ];

        expect(mapTopics(topics)).toStrictEqual([
            {
                id: '1',
                name: 'meeting topic 1',
                meetingType: 'Speakers Meeting',
                meetingRecordTypes: 'Displays and Exhibits',
                status: 'approved',
                startDate: '2021-07-07T12:07:34.000+0000',
                endDate: '2021-07-07T12:07:34.000+0000',
                currencyIsoCode: 'currencyIsoCode'
            },
        ]);
    });

    it('return mapRecordType', () => {
        expect(mapRecordType('Rep_Presentation')).toStrictEqual('RepPresentation');
        expect(mapRecordType('')).toBeUndefined();
    });

    it('return convertRecordType', () => {
        expect(convertRecordType('Rep_Presentation')).toStrictEqual('RepPresentation');
        expect(convertRecordType('Displays_Exhibits')).toStrictEqual('Displays and Exhibits');
        expect(convertRecordType('Speaker_Meeting')).toStrictEqual('Speaker Meeting');
        expect(convertRecordType('HCP_Sponsorship')).toStrictEqual('HCP Sponsorship');
        expect(convertRecordType('Test_String')).toStrictEqual('Test_String');
    });

    it('return mapMeetingTopics', () => {
        const meetingTopics = [
            {
                Id: '2',
                Name: 'meeting topic 2',
                OCE__MeetingType__c: 'HCP Sponsorship',
                OCE__Status__c: 'approved',
                OCE__EndDate__c: '2021-07-07T12:07:34.000+0000',
            },
        ];

        expect(mapMeetingTopics(meetingTopics)).toStrictEqual([
            {
                id: '2',
                Name: 'meeting topic 2',
                OCE__Status__c: 'approved',
                OCE__MeetingType__c: 'HCP Sponsorship',
                OCE__EndDate__c: "2021-07-07T12:07:34.000+0000",
                topic: undefined,
            },
        ]);
        expect(mapMeetingTopics([])).toStrictEqual([]);
    });
});