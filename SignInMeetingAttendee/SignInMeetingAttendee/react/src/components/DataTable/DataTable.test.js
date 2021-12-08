import React from 'react';
import { NativeModules } from 'react-native';
import DataTable from './DataTable';
import renderer, { act } from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingMemberLayout, meetingConfigData } from "../../constants/mockData";
import * as commonConstants from '../../constants';
import TableHeader from '../TableHeader/TableHeader'

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));


jest.mock("../../../bridge/Localization/localization.native");



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

        const tree = renderer.create(
            <DataTable />
        ).toJSON();
        jest.advanceTimersByTime(1000);
        expect(tree).toMatchSnapshot();
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

        const tree = renderer.create(
            <DataTable />
        ).toJSON();
        jest.advanceTimersByTime(1000);
        expect(tree).toMatchSnapshot();
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

        const tree = renderer.create(
            <DataTable />
        ).toJSON();
        jest.advanceTimersByTime(1000);
        expect(tree).toMatchSnapshot();
    })

    it('TableHeader should contain inside DataTable component', async () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                meetingGenConfig: meetingConfigData,
            }
        }));
        const tree = renderer.create(
            <DataTable />
        );
        await act(async () => {
            const tableHeaderComp = tree.root.findByType(TableHeader);
            tableHeaderComp.props.onChangeRecordType({ id: 'ALL' });
            tableHeaderComp.props.onChangeSearch('Internal Medicine');
            jest.advanceTimersByTime(500);
        });
    })

});
