import React from 'react';
import SignBoxiPhoneFooter from './SignBoxiPhoneFooter';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../../constants/mockData";
import { render } from '@testing-library/react-native';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Signature Box Footer for iPhone', () => {
    it('SignFooter Component  for iPhone should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const handleClear = jest.fn();
        const onDoneSignAttende = jest.fn();

        const { getByTestId } = render(
            <SignBoxiPhoneFooter handleClear={handleClear} onDoneSignAttende={onDoneSignAttende} />
        )

        expect(getByTestId('SignBoxiPhoneFooter')).toBeTruthy();
    })

});
