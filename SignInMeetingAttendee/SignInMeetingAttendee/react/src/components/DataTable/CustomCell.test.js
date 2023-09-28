import React from 'react';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { meetingLevelConfigRecord, meetingLevelConfigRecordForcheck } from "../../constants/mockData";
import { NAMESPACE } from '../../constants'
import CustomCell from './CustomCell';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Custom cell Component', () =>  {

    it('custom header should render properly', async () => {
        const row = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
            OCE__AddressText__c: null,
            OCE__AttendanceStatus__c: "Attended-eSigned",
            OCE__AttendeeType__c: null,
            OCE__Customer__c: null,
            OCE__DiscrepancyReason__c: null,
            OCE__MealOption__c: null,
            OCE__Meal__c: 0,
            OCE__SignatureDate__c: "2021-10-11T16:29:27.000+0000",
            OCE__SpecialtyText__c: null,
            OCE__Status__c: null,
            RecordTypeId: "0120k000000GlNqAAK",
            accountDetails: [],
            discrepancyReasons: undefined,
            key: "a420k0000005NTIAA2",
            uid: "a420k0000005NTIAA2",
            validateRestrictedFields: jest.fn()
        }
        const column = {
            accessor: `${NAMESPACE}MealOption__c`
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const { getByTestId } = render(
            <CustomCell row={row} column={column} />
        );
        expect(getByTestId('CustomCell')).toBeTruthy();
    })
    it('custom header should render YES  if meal__C field is there', async () => {
        const row = {
            Id: "a420k00000e5NTIAA2",
            Name: "Test set",
            OCE__MealOption__c: null,
            OCE__Meal__c: 1,
            validateRestrictedFields: jest.fn()
        }
        const column = {
            accessor: `${NAMESPACE}MealOption__c`
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingConfig: meetingLevelConfigRecordForcheck,
            }
        }));
        const { findByText } = render(
            <CustomCell row={row} column={column} />
        );
        expect(findByText(/Yes/i)).toBeTruthy();
    })
    it('custom cell should render meal option is a checkbox', async () => {
        const row = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
            OCE__MealOption__c: null,
            OCE__Meal__c: 1,
            validateRestrictedFields: jest.fn()
        }
        const column = {
            accessor: `${NAMESPACE}MealOption__c`
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingConfig: meetingLevelConfigRecordForcheck,
            }
        }));
        const { getByTestId } = render(
            <CustomCell row={row} column={column} />
        );
        expect(getByTestId('CustomCell')).toBeTruthy();
    })
    it('custom cell should render NO  if meal__C field is not there', async () => {
        const row = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
            OCE__MealOption__c: null,
            OCE__Meal__c: 0,
            validateRestrictedFields: jest.fn()
        }
        const column = {
            accessor: `${NAMESPACE}MealOption__c`
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingConfig: meetingLevelConfigRecordForcheck,
            }
        }));
        const { findByText } = render(
            <CustomCell row={row} column={column} />
        );
        expect(findByText(/No/i)).toBeTruthy();
    })
    it('custom cell should render other columns accessors', async () => {
        const row = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
            OCE__MealOption__c: null,
            OCE__Meal__c: 0,
            validateRestrictedFields: jest.fn()
        }
        const column = {
            accessor: `${NAMESPACE}SpecialtyText__c`
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingConfig: meetingLevelConfigRecordForcheck,
            }
        }));
        const { getByTestId } = render(
            <CustomCell row={row} column={column} />
        );
        expect(getByTestId('CustomCell')).toBeTruthy();
    })
});
