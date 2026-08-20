import React from 'react';
import SignStepOne from './SignStepOne';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records } from "../../../../constants/mockData";


jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Signing step one', () => {
    it('SigningStepOne Component should render properly', async () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                signature: null
            }
        }));
        const {getAllByPlaceholderText}= render(
            <SignStepOne />
        );
        expect(getAllByPlaceholderText(/Full Name/i)).toBeTruthy();
    })
    it('SigningStepOne Component should render properly if meetingdetails is not fetched', async () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: [{}],
                signature: null
            }
        }));
        const {getAllByPlaceholderText}= render(
            <SignStepOne />
        );
        expect(getAllByPlaceholderText(/Full Name/i)).toBeTruthy();
    })

});
