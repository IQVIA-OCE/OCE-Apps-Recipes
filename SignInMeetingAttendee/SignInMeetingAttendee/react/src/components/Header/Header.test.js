import React from 'react';
import Header from './Header';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingMemberLayout } from "../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));


jest.mock("../../../bridge/Localization/localization.native");

describe('Widget Header', () => {
    it('Header Component should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const tree = renderer.create(
            <Header />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

});
