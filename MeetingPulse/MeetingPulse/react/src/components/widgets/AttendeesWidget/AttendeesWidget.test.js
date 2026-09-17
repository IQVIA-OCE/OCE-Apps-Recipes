import React from 'react';
import { Provider } from 'react-redux';
import * as attendeesApi from '../../../api/attendeesApi';
import AttendeesWidget from './AttendeesWidget';
import { render, waitFor } from '@testing-library/react-native';
import store from '../../../store/store';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

const ATTENDEES_LIST_MOCK = [
  [
    {
      Status__c: 'Accepted',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncsIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Colleague',
      },
      Name: 'OCEADMIN OCEADMIN',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUFIA4',
      },
      Type__c: 'Organizer',
      Id: 'a3pO0000001BSUFIA4',
      Email__c: 'oceadmin@dreamcompany.com.invalid',
    },
    {
      Status__c: 'Invited',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'AARON H MORITA',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUKIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUKIA4',
      Email__c: null,
    },
    {
      Status__c: 'Waitlisted',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'AMER RAHMAN',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUQIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUQIA4',
      Email__c: null,
    },
    {
      Status__c: 'Walk In',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'ANGELO MIELE',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUPIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUPIA4',
      Email__c: null,
    },
    {
      Status__c: 'Nominated',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'AARON NEWCOMB',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUWIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUWIA4',
      Email__c: null,
    },
    {
      Status__c: 'Cancelled Late',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'ADAM DAVID STEIN',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUVIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUVIA4',
      Email__c: null,
    },
    {
      Status__c: 'Accepted',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'ABDULLAH BAIG',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUUIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUUIA4',
      Email__c: null,
    },
    {
      Status__c: 'Declined',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'ABHINAV SINHA',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUTIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUTIA4',
      Email__c: null,
    },
    {
      Status__c: 'Not Applicable',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'Arizona Cardiology Group',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSUSIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSUSIA4',
      Email__c: null,
    },
    {
      Status__c: 'Tentative',
      RecordType: {
        attributes: {
          url: '/services/data/v50.0/sobjects/RecordType/012O0000000XncrIAC',
          type: 'RecordType',
        },
        DeveloperName: 'Attendee',
      },
      Name: 'Apple Rehab Laurel Woods',
      MeetingRecordTypeName__c: 'Rep_Presentation',
      attributes: {
        type: 'MeetingMember__c',
        url: '/services/data/v50.0/sobjects/MeetingMember__c/a3pO0000001BSURIA4',
      },
      Type__c: null,
      Id: 'a3pO0000001BSURIA4',
      Email__c: null,
    },
  ],
];

describe('AttendeesWidget', () => {
  it('should render correctly', async () => {
    const spy = jest.spyOn(attendeesApi, 'fetchMeetingAttendees');

    spy.mockResolvedValue(ATTENDEES_LIST_MOCK);

    const { getByTestId } = render(
      <Provider store={store}>
        <AttendeesWidget />
      </Provider>
    );

    const widget = await waitFor(() => getByTestId('Attendees_widget'));

    expect(widget).toBeTruthy();
  });
});
