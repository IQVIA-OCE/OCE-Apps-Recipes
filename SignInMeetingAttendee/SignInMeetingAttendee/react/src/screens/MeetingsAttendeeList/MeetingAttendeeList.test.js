import React from 'react';
import MeetingAttendeeList from './MeetingAttendeeList';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingMemberLayout, meetingHighLightPanel } from "../../constants/mockData";
import { locationManager, externalNavigator } from 'oce-apps-bridges';
import { NativeModules } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { IconButton } from 'apollo-react-native';

jest.useFakeTimers();

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

NativeModules.ReachabilityBridge = {
    networkReachabilityStatus: jest.fn()
        .mockResolvedValueOnce('ONLINE')
        .mockRejectedValue('ERROR')
}

describe('MeetingListAttendees Widget', () => {
    beforeEach(() => {
        externalNavigator.open.mockImplementation(arg => {
            redirectURL = arg;
        });
    });

    it('Meeting List attendeess should render properly', async () => {


        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                error: {
                    code: 'ERR',
                    message: 'INVALID'
                },
                signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLgAAAI",
                meetingHighLightPanel: meetingHighLightPanel,
                validationAlert: true,
            }
        }));
        const { getByTestId } = render(
            <MeetingAttendeeList />
        );
        jest.advanceTimersByTime(500);

        expect(getByTestId('loader-wrap')).toBeTruthy();
    })


    it('Meeting List attendeess should render properly with offline and location service', async () => {
        const { ReachabilityBridge } = NativeModules;
        const locatonListener = jest.fn();
        jest.spyOn(ReachabilityBridge, "networkReachabilityStatus").mockImplementation(() => Promise.resolve('No Connection'));
        jest.spyOn(locationManager, "getLocationStatus").mockImplementation(() => Promise.resolve({
            locationServicesEnabled: true,
            authorizationStatus: 'authorizedWhenInUse'
        }));
        jest.spyOn(locationManager, "addLocationListener").mockImplementation(() => Promise.resolve(locatonListener));
        jest.spyOn(locationManager, "removeLocationListener").mockImplementation(() => Promise.resolve(locatonListener));
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                error: {
                    code: 'ERR',
                    message: 'INVALID'
                },
                signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLgAAAI",
                meetingHighLightPanel: meetingHighLightPanel,
                validationAlert: true,
            }
        }));
        const { getByTestId, UNSAFE_queryAllByType } = render(
            <MeetingAttendeeList />
        );

        jest.advanceTimersByTime(500);
        const iconButtons = UNSAFE_queryAllByType(IconButton);
        fireEvent.press(iconButtons[0]);
        fireEvent.press(iconButtons[1]);
        fireEvent.press(iconButtons[2]);
        expect(getByTestId('loader-wrap')).toBeTruthy();
    })
    it('Meeting List attendeess should render properly with denied location service', async () => {
        jest.spyOn(locationManager, "getLocationStatus").mockImplementation(() => Promise.resolve({
            locationServicesEnabled: true,
            authorizationStatus: 'denied'
        }));
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                error: {
                    code: 'ERR',
                    message: 'INVALID'
                },
                signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLgAAAI",
                meetingHighLightPanel: meetingHighLightPanel,
                validationAlert: true,
            }
        }));
        const { getByTestId } = render(
            <MeetingAttendeeList />
        );
        jest.advanceTimersByTime(500);
        expect(getByTestId('loader-wrap')).toBeTruthy();
    })
    it('Meeting List attendeess should render properly with location service disabled', async () => {
        jest.spyOn(locationManager, "getLocationStatus").mockImplementation(() => Promise.resolve({
            locationServicesEnabled: false,
            authorizationStatus: 'denied'
        }));
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                error: {
                    code: 'ERR',
                    message: 'INVALID'
                },
                signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLgAAAI",
                meetingHighLightPanel: meetingHighLightPanel,
                validationAlert: true,
            }
        }));
        const { getByTestId } = render(
            <MeetingAttendeeList />
        );
        jest.advanceTimersByTime(500);
        expect(getByTestId('loader-wrap')).toBeTruthy();
    })

    it('Meeting List attendeess should render properly with promise rejection in lcoation services', async () => {
        jest.spyOn(locationManager, "getLocationStatus").mockImplementation(() => Promise.reject(new Error()));
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                error: {
                    code: 'ERR',
                    message: 'INVALID'
                },
                signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLgAAAI",
                meetingHighLightPanel: meetingHighLightPanel,
                validationAlert: true,
            }
        }));
        const { getByTestId } = render(
            <MeetingAttendeeList />
        );

        jest.advanceTimersByTime(500);
        expect(getByTestId('loader-wrap')).toBeTruthy();
    })

});


