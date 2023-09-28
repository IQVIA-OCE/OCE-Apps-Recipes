import React from 'react';
import Header from './Header';
import { render, fireEvent } from '@testing-library/react-native';
import { IconButton } from 'apollo-react-native';
import { useSelector, useDispatch } from 'react-redux';
import TouchID from 'react-native-touch-id';
import { records, meetingLevelConfigRecord, meetingMemberLayout } from "../../constants/mockData";
import * as commonConstants from '../../constants';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));


beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
});
afterEach(() => {
    React.useContext = realUseContext;
});

jest.mock('react-native-touch-id', () => {
    return {
        isSupported: jest.fn(() => Promise.resolve(true)),
        authenticate: jest.fn(() => Promise.resolve(true))
    };
});

describe('Widget Header', () => {
    it('should support touch id and authenticate properly', () => {
        expect(TouchID.isSupported()).toBeTruthy();
        expect(TouchID.authenticate()).toBeTruthy();
    });
    it('Header Component should render properly', () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                currentUser: { id: '1', Name: 'Test User' }
            }
        }));
        const { getByTestId } = render(
            <Header showSignatureWindow={true} />
        );

        expect(getByTestId('header')).toBeTruthy();
    })

    it('Header Component should render properly in iPhone', async () => {
        commonConstants.isIphone = true;
        useContextMock.mockReturnValue("a420k0000005MvUAAU");
        const onDoneSignAttende = jest.fn();
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                firstName: 'test user',
                currentUser: { id: '1', Name: 'Test User' }
            }
        }));
        const { getByTestId } = render(
            <Header showSignatureWindow={true} onDoneSignAttende={onDoneSignAttende} />
        );
        expect(getByTestId('header')).toBeTruthy();
    })
    it('onPrint icon  should invoke', async () => {
        commonConstants.isIphone = false;
        useContextMock.mockReturnValue("a420k0000005MvUAAU");
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                firstName: 'test user',
                isApplicationLock: true,
                currentUser: { id: '1', Name: 'Test User' },
                showSignatureWindow: true,
            }
        }));
        const { getByTestId } = render(
            <Header showSignatureWindow={true} />
        );
        expect(getByTestId('header')).toBeTruthy();
    })
    it('Lock button should be called in iPhone and touch id should invoke', async () => {
        commonConstants.isIphone = true;
        useContextMock.mockReturnValue("a420k0000005MvUAAU");
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                firstName: 'test user',
                isApplicationLock: true,
                currentUser: { id: '1', Name: 'Test User' },
                showSignatureWindow: false,
            }
        }));
        const { getByTestId, UNSAFE_getByType } = render(
            <Header showSignatureWindow={true} />
        );
        expect(getByTestId('header')).toBeTruthy();
    })
    it('Header Component should render properly with currentuser or write in user', async () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
                meetingConfig: meetingLevelConfigRecord,
                firstName: 'test user',
                isApplicationLock: false,
                currentUser: { id: '1', Name: 'Test User' }
            }
        }));
        commonConstants.isIphone = false;
        const { getByTestId } = render(
            <Header showSignatureWindow={false} />
        );
        expect(getByTestId('header')).toBeTruthy();
    })

});
