import React from 'react';
import MeetingHeaderiPhone from './MeetingHeaderiPhone';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingHighLightPanel } from "../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        timeZone: () => 'America/Los_Angeles',
        profileId: () => '2',
        organizationId: () => '3'
    },
}));

describe('Meeting Header for iPhone', () => {
    it('Meeting Header Component  for iPhone should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingHighLightPanel: meetingHighLightPanel
            }
        }));
        const tree = renderer.create(
            <MeetingHeaderiPhone />
        ).toJSON();
        jest.advanceTimersByTime(1000);
        expect(tree).toMatchSnapshot();
    })

});
