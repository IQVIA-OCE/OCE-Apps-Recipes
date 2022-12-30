import React from 'react';
import SignBox from './SignBox';
import { render } from '@testing-library/react-native';
import { Provider, DarkTheme } from 'apollo-react-native'
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingMemberLayout } from "../../../constants/mockData";
import SignatureScreen from 'react-native-signature-canvas';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Signature Box', () => {
    it('Signature Box widget should render properly', async () => {

        const handleBegin = jest.fn();
        const handleEnd = jest.fn();
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
                meetingLayouts: meetingMemberLayout,
            }
        }));
        const { getByTestId, UNSAFE_getByType } = render(
            <SignBox handleBegin={handleBegin} handleEnd={handleEnd} />
        );
        UNSAFE_getByType(SignatureScreen).props.onOK()
        expect(getByTestId('SignBox')).toBeTruthy();
    })

    it('Signature Box widget should render properly in darkmode', async () => {
        const handleBegin = jest.fn();
        const handleEnd = jest.fn();
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
                meetingLayouts: meetingMemberLayout,
            }
        }));
        const { getByTestId, UNSAFE_getByType } = render(
            <Provider theme={DarkTheme}>
                <SignBox handleBegin={handleBegin} handleEnd={handleEnd} />
            </Provider>
        );
        UNSAFE_getByType(SignatureScreen).props.onOK()
        expect(getByTestId('SignBox')).toBeTruthy();
    })
});
