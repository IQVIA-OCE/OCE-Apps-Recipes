import React from 'react';
import SignStepOne from './SignStepOne';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records } from "../../../../constants/mockData";


jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock("../../../../../bridge/Localization/localization.native");

describe('Signing step one', () => {
    it('SigningStepOne Component should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                signature: null
            }
        }));
        const tree = renderer.create(
            <SignStepOne />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

});
