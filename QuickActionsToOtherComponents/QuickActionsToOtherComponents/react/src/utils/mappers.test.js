import {
  CALL_ATTENDEES_MAPPED_DATA,
  CALL_ATTENDEES_ORIG_DATA,
  CALL_MAPPED_DATA,
  CALL_ORIG_DATA,
  INQUIRIES_MAPPED_DATA,
  INQUIRIES_ORIG_DATA,
  INQUIRY_CHANNEL_MAPPED_DATA,
  INQUIRY_CHANNEL_ORIG_DATA,
  INQUIRY_FROM_FORM,
  INQUIRY_TO_SAVE,
  INQUIRY_TYPE_MAPPED_DATA,
  INQUIRY_TYPE_ORIG_DATA,
  ORDERS_MAPPED_DATA,
  ORDERS_ORIG_DATA,
  STORE_CHECK_MAPPED_DATA,
  STORE_CHECK_ORIG_DATA,
} from '../mocks/callTestData';
import {
  CALLS_MAPPED_DATA,
  CALLS_ORIG_DATA,
  MEETING_ATTENDEES_MAPPED_DATA,
  MEETING_ATTENDEES_ORIG_DATA,
  MEETING_MAPPED_DATA,
  MEETING_ORIG_DATA,
} from '../mocks/meetingTestData';
import * as helpers from './common';
import {
  callAttendeesMapper,
  callMapperForCall,
  callsMapperForMeeting,
  convertInquiry,
  formPickListMapper,
  inquiriesMapper,
  meetingAttendeesMapper,
  meetingMapper,
  ordersMapper,
  storeCheckMapper,
} from './mappers';

describe('mappers utils', () => {
  afterEach(() => {
    helpers.isWeb = false;
  });

  test('callMapperForCall() mapper should map call', () => {
    expect(callMapperForCall(CALL_ORIG_DATA)).toStrictEqual(CALL_MAPPED_DATA);
    helpers.isWeb = true;
    expect(callMapperForCall(CALL_ORIG_DATA)).toStrictEqual(CALL_MAPPED_DATA);
  });

  test('ordersMapper() mapper should map orders', () => {
    expect(ordersMapper(ORDERS_ORIG_DATA)).toStrictEqual(ORDERS_MAPPED_DATA);
  });

  test('inquiriesMapper() mapper should map inquiries', () => {
    expect(inquiriesMapper(INQUIRIES_ORIG_DATA)).toStrictEqual(
      INQUIRIES_MAPPED_DATA
    );
    helpers.isWeb = true;
    expect(inquiriesMapper(INQUIRIES_ORIG_DATA)).toStrictEqual(
      INQUIRIES_MAPPED_DATA
    );
  });

  test('storeCheckMapper() mapper should map store checks', () => {
    expect(storeCheckMapper(STORE_CHECK_ORIG_DATA)).toStrictEqual(
      STORE_CHECK_MAPPED_DATA
    );
  });

  test('meetingMapper() mapper should map meeting', () => {
    expect(meetingMapper(MEETING_ORIG_DATA)).toStrictEqual(MEETING_MAPPED_DATA);
  });

  test('callsMapperForMeeting() mapper should map calls', () => {
    expect(callsMapperForMeeting(CALLS_ORIG_DATA)).toStrictEqual(
      CALLS_MAPPED_DATA
    );
    helpers.isWeb = true;
    expect(callsMapperForMeeting(CALLS_ORIG_DATA)).toStrictEqual(
      CALLS_MAPPED_DATA
    );
  });

  test('meetingAttendeesMapper() mapper should map meeting attendees', () => {
    expect(meetingAttendeesMapper(MEETING_ATTENDEES_ORIG_DATA)).toStrictEqual(
      MEETING_ATTENDEES_MAPPED_DATA
    );
  });

  test('formPickListMapper() mapper should map form pickList', () => {
    expect(formPickListMapper(INQUIRY_CHANNEL_ORIG_DATA)).toStrictEqual(
      INQUIRY_CHANNEL_MAPPED_DATA
    );
    expect(formPickListMapper(INQUIRY_TYPE_ORIG_DATA)).toStrictEqual(
      INQUIRY_TYPE_MAPPED_DATA
    );
  });

  test('convertInquiry() mapper should convert inquiry to DB structure', () => {
    expect(convertInquiry(INQUIRY_FROM_FORM)).toStrictEqual(INQUIRY_TO_SAVE);
  });

  test('callAttendeesMapper() mapper should map call attendees', () => {
    expect(callAttendeesMapper(CALL_ATTENDEES_ORIG_DATA)).toStrictEqual(
      CALL_ATTENDEES_MAPPED_DATA
    );
    helpers.isWeb = true;
    expect(callAttendeesMapper(CALL_ATTENDEES_ORIG_DATA)).toStrictEqual(
      CALL_ATTENDEES_MAPPED_DATA
    );
  });
});
