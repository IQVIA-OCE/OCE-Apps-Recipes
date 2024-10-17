import { NAMESPACE } from '../../../constants';
import { mapMeeting } from '../utils/meetingMappers'

describe('mapMeeting', () => {
  it('return mapMeeting', () => {
    const meeting = {
      Id: '1',
      Name: 'Meeting Name',
      [`RecordType.Name`]: 'meeting',
      [`RecordType.DeveloperName`]: 'DeveloperName',
      [`${NAMESPACE}StartDateTime__c`]: '2021-07-07T12:07:34.000+0000',
      [`${NAMESPACE}EndDateTime__c`]: '2021-07-07T12:07:34.000+0000',
    };

    expect(mapMeeting(meeting)).toStrictEqual({
      id: '1',
      name: 'Meeting Name',
      recordTypeName: 'meeting',
      recordTypeDevName: 'DeveloperName',
      startDate: '2021-07-07T12:07:34.000+0000',
      endDate: '2021-07-07T12:07:34.000+0000',
    });
  });
});
