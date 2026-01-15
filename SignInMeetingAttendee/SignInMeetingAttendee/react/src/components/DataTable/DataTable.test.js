import React from 'react';
import { NativeModules } from 'react-native';
import DataTable from './DataTable';
import { fireEvent, render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Select } from '@oce-apps/apollo-react-native';
import { records, meetingLevelConfigRecord, meetingMemberLayout, meetingConfigData } from "../../constants/mockData";
import { NAMESPACE } from '../../constants'

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

const COLUMNS = [
    {
        header: 'Name',
        accessor: 'Name',
        sortFunction: null,
    },
    {
        header: 'Address',
        accessor: `${NAMESPACE}AddressText__c`,
        sortFunction: null,
    },
    {
        header: 'Specialty',
        accessor: `${NAMESPACE}SpecialtyText__c`,
        sortFunction: null,
    },
    {
        header: 'Meal Option',
        accessor: `${NAMESPACE}MealOption__c`,
        sortFunction: null,
    },
    {
        header: 'Sign In',
        accessor: `${NAMESPACE}SignatureDate__c`,
        sortFunction: null,

    },
];

describe('Data Table ', () => {
    it('Data Table Component should render properly when network avilable', () => {
        NativeModules.ReachabilityBridge = {
            networkReachabilityStatus: jest.fn()
                .mockResolvedValueOnce('ONLINE')
                .mockRejectedValue('ERROR')
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                meetingGenConfig: meetingConfigData,
            }
        }));
        const onSignInAttendee = jest.fn();
        const showWriteInAttendeeModal = jest.fn();
        const { getByTestId, UNSAFE_getByType, getByPlaceholderText } = render(
            <DataTable onSignInAttendee={onSignInAttendee} showWriteInAttendeeModal={showWriteInAttendeeModal} />
        );
        jest.advanceTimersByTime(1000);
        UNSAFE_getByType(Select).props.onChange({ label: 'All', value: 'All' });
        fireEvent.changeText(getByPlaceholderText(/Search/i), 'Ashok');
        expect(getByTestId('meeting-member-list')).toBeTruthy();
    })
    it('Data Table Component should render properly when network is not available', () => {
        NativeModules.ReachabilityBridge = {
            networkReachabilityStatus: jest.fn()
                .mockResolvedValueOnce('No Connection')
                .mockRejectedValue('ERROR')
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                meetingGenConfig: meetingConfigData,
            }
        }));

        const { getByTestId } = render(
            <DataTable />
        );
        jest.advanceTimersByTime(1000);
        expect(getByTestId('meeting-member-list')).toBeTruthy();
    })
    it('Data Table Component should render properly when network status is not found', () => {
        NativeModules.ReachabilityBridge = {
            networkReachabilityStatus: jest.fn()
                .mockResolvedValueOnce('Invalid')
                .mockRejectedValue('ERROR')
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                meetingGenConfig: meetingConfigData,
            }
        }));

        const { getByTestId } = render(
            <DataTable />
        );
        jest.advanceTimersByTime(1000);
        expect(getByTestId('meeting-member-list')).toBeTruthy();
    })

    test('DataTable should contain Table Component', async () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                meetingGenConfig: meetingConfigData,
            }
        }));
        jest.advanceTimersByTime(500);
        const ROWS = records[0][`${NAMESPACE}MeetingMember__r`].records;
        COLUMNS[0].sortFunction = jest.fn();
        const { getByTestId } = render(
            <Table columns={COLUMNS} rows={ROWS} />
        );
    })
    test('DataTable should render for empty meeting members', async () => {
        const updatedVal = { ...records[0], [`${NAMESPACE}MeetingMember__r`]: [] }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: [updatedVal],
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                meetingGenConfig: meetingConfigData,
            }
        }));
        jest.advanceTimersByTime(500);
        const ROWS = records[0][`${NAMESPACE}MeetingMember__r`].records;
        COLUMNS[0].sortFunction = jest.fn();
        const { getByTestId } = render(
            <Table columns={COLUMNS} rows={ROWS} />
        );
    })

});
