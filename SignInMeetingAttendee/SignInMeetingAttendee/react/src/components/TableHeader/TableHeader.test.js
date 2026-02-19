import React from 'react';
import TableHeader from './TableHeader';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingMemberLayout } from "../../constants/mockData";
import * as commonConstants from '../../constants'


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Table Header', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });


    it('Table Header Component should render properly', () => {
        commonConstants.isIphone = true;
        const validateMeeting = true;
        const selectedRecordType = 'ALL';
        const onChangeSearch = jest.fn();
        const showWriteInAttendeeModal = false;
        const onChangeRecordType = jest.fn();
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
            }
        }));
        const { getByTestId } = render(
            <TableHeader
                showWriteInAttendeeModal={showWriteInAttendeeModal}
                onChangeRecordType={onChangeRecordType}
                validateMeeting={validateMeeting}
                selectedRecordType={selectedRecordType}
                onChangeSearch={onChangeSearch}
            />
        );

        expect(getByTestId('table-header')).toBeTruthy();
    })
    it('Table Header Component should render properly in iphone', () => {
        commonConstants.isIphone = false;
        const validateMeeting = true;
        const selectedRecordType = 'ALL';
        const onChangeSearch = jest.fn();
        const showWriteInAttendeeModal = false;
        const onChangeRecordType = jest.fn();
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
            }
        }));
        const { getByTestId } = render(
            <TableHeader
                showWriteInAttendeeModal={showWriteInAttendeeModal}
                onChangeRecordType={onChangeRecordType}
                validateMeeting={validateMeeting}
                selectedRecordType={selectedRecordType}
                onChangeSearch={onChangeSearch}
            />
        );

        expect(getByTestId('table-header')).toBeTruthy();
    })
});
