import React from 'react';
import ModalHeader from './ModalHeader';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records } from "../../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Modal Header', () => {
    it('ModalHeader Component should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingInfo: records,
                signature: null,
                firstName: 'test user'
            }
        }));
        const dismissModal = jest.fn();
        const onSignAttendee = jest.fn();

        const { getByTestId } = render(
            <ModalHeader dismissModal={dismissModal} onSignAttendee={onSignAttendee} />
        );
        jest.advanceTimersByTime(500);
        expect(getByTestId('Sign')).toBeTruthy();
    })
    it('ModalHeader Component should render properly without name', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingInfo: records,
                signature: null,
                firstName: null
            }
        }));
        const dismissModal = jest.fn();
        const onSignAttendee = jest.fn();

        const { getByTestId } = render(
            <ModalHeader dismissModal={dismissModal} onSignAttendee={onSignAttendee} />
        );
        jest.advanceTimersByTime(500);
        expect(getByTestId('Sign')).toBeTruthy();
    })

});
