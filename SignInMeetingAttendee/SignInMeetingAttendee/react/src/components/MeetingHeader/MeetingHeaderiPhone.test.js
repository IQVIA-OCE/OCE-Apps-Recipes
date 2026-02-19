import React from 'react';
import { NativeModules } from 'react-native';
import MeetingHeaderiPhone from './MeetingHeaderiPhone';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingHighLightPanel } from "../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

NativeModules.ReachabilityBridge = {
    networkReachabilityStatus: jest.fn()
        .mockResolvedValueOnce('No Connection')
        .mockRejectedValue('ERROR')
}

describe('Meeting Header for iPhone', () => {
    it('Meeting Header Component  for iPhone should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingHighLightPanel: meetingHighLightPanel
            }
        }));
        const { getByText } = render(
            <MeetingHeaderiPhone />
        );
        jest.advanceTimersByTime(1000);
        expect(getByText(/Meeting Name/i)).toBeTruthy();
    })
    it('Meeting Header Component  for iPhone should render properly when network is offline', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingHighLightPanel: []
            }
        }));
        const { findByText } = render(
            <MeetingHeaderiPhone />
        );
        jest.advanceTimersByTime(1000);
        expect(findByText(/Meeting Name/i)).toBeTruthy();
    })
});
