import React from 'react';
import { NativeModules } from 'react-native';
import MeetingHeader from './MeetingHeader';
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
        .mockResolvedValueOnce('ONLINE')
        .mockRejectedValue('ERROR')
}

describe('Meeting Header', () => {
    it('Meeting Header Component should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingHighLightPanel: meetingHighLightPanel
            }
        }));
        const { getByText } = render(
            <MeetingHeader />
        );
        jest.advanceTimersByTime(1000);
        expect(getByText).toBeTruthy();
    })

});

