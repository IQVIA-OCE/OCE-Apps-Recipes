import React from 'react';
import UserDetails from './UserDetails';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records } from "../../../constants/mockData";

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../../../bridge/Localization/localization.native', () => ({
    localized: (_, fallback) => fallback,
}));

describe('User Details in iPhone Header', () => {
    it('User Details Component in iPhone Header  should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
            }
        }));
        const tree = renderer.create(
            <UserDetails />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })
});
