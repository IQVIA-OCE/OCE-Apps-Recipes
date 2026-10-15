import React from 'react';
import SignBoxiPhone from './SignBoxiPhone';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../../constants/mockData";
import SignatureScreen from 'react-native-signature-canvas';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));


const mockUseRef = (obj) => () => Object.defineProperty({}, 'current', {
    get: () => obj,
    set: () => { }
})

describe('Signature Box for iPhone', () => {
    it('Signature Box widget for iPhone should render properly', () => {

        const ref = mockUseRef({ refFunction: jest.fn() })
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const { getByTestId, UNSAFE_getByType } = render(
            <SignBoxiPhone ref={ref} />
        )
        UNSAFE_getByType(SignatureScreen).props.onOK()
        expect(getByTestId('SignBoxiPhone')).toBeTruthy();
    })

});
