import React from 'react';
import SignBoxiPhoneFooter from './SignBoxiPhoneFooter';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));


jest.mock("../../../../bridge/Localization/localization.native");


describe('Signature Box Footer for iPhone', () => {
    it('SignFooter Component  for iPhone should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const tree = renderer.create(
            <SignBoxiPhoneFooter />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

});
