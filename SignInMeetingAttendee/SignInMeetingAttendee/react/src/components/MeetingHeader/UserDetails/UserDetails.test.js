import React from 'react';
import UserDetails from './UserDetails';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records } from "../../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('User Details in iPhone Header', () => {
    it('User Details Component in iPhone Header  should render properly', () => {
        jest.spyOn(React, 'useContext').mockImplementation(() => 'a420k0000005MvUAAU');

        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
            }
        }));
        const { getByText } = render(
            <UserDetails />
        );
        expect(getByText(/ASHOK KUMAR/)).toBeTruthy();
    })
});
