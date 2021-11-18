import React from 'react';
import TableHeader from './TableHeader';
import renderer from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingMemberLayout } from "../../constants/mockData";
import { Search } from 'apollo-react-native';


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock("../../../bridge/Localization/localization.native");

describe('Table Header', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });


    it('Table Header Component should render properly', () => {
        const onChangeRecordType = jest.fn();
        const validateMeeting = true;
        const selectedRecordType = 'ALL';
        const onChangeSearch = jest.fn();
        const showWriteInAttendeeModal = false;
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingLayouts: meetingMemberLayout,
            }
        }));
        const tree = renderer.create(
            <TableHeader
                showWriteInAttendeeModal={showWriteInAttendeeModal}
                onChangeRecordType={onChangeRecordType}
                validateMeeting={validateMeeting}
                selectedRecordType={selectedRecordType}
                onChangeSearch={onChangeSearch}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    })

});
