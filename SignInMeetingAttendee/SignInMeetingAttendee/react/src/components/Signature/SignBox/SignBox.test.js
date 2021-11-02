import React from 'react';
import SignBox from './SignBox';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock("../../../../bridge/Localization/localization.native");

describe('Signature Box', () => {
    it('Signature Box widget should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const tree = renderer.create(
            <SignBox />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

});
