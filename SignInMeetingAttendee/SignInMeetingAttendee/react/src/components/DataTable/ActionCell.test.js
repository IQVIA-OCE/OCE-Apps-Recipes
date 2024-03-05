import React from 'react';
import {render, act, fireEvent} from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingConfigData } from "../../constants/mockData";
import ActionCell from './ActionCell';
import { NAMESPACE } from '../../constants';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Action Cell Component', () => {
    it('Action Cell should render properly', async () => {
        const row = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
            [`${NAMESPACE}AddressText__c`]: null,
            [`${NAMESPACE}AttendanceStatus__c`]: "Attended-eSigned",
            [`${NAMESPACE}AttendeeType__c`]: null,
            [`${NAMESPACE}Customer__c`]: null,
            [`${NAMESPACE}DiscrepancyReason__c`]: null,
            [`${NAMESPACE}MealOption__c`]: null,
            [`${NAMESPACE}Meal__c`]: 0,
            [`${NAMESPACE}SignatureDate__c`]: "2021-10-11T16:29:27.000+0000",
            [`${NAMESPACE}SpecialtyText__c`]: null,
            [`${NAMESPACE}Status__c`]: null,
            RecordTypeId: "0120k000000GlNqAAK",
            accountDetails: [],
            discrepancyReasons: undefined,
            key: "a420k0000005NTIAA2",
            uid: "a420k0000005NTIAA2",
            validateRestrictedFields: jest.fn()
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingGenConfig: meetingConfigData,
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const { getByText, getByTestId } = render(
            <ActionCell row={row} />
        );
        await act(async () => {

            const notListed = getByTestId('ActionCell');
            fireEvent.press(notListed);
            jest.advanceTimersByTime(500);
        });
        expect(getByText(/Sign In/i)).toBeTruthy();
    })
    it('Action Cell should render properly without records', () => {
        const row = {
            validateRestrictedFields: jest.fn()
        }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingGenConfig: meetingConfigData,
                meetingDetails: [],
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const { getByText } = render(
            <ActionCell row={row} />
        );
        jest.advanceTimersByTime(500);
        expect(getByText(/Sign In/i)).toBeTruthy();
    })
    it('sign in link should be enabled in Action cell component', () => {
        const row = {
            validateRestrictedFields: jest.fn(),
            [`${NAMESPACE}SignatureDate__c`]: null,
        }

        const updatedVal = { ...meetingConfigData[0], [`${NAMESPACE}EnableConsent__c`]: 0 }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingGenConfig: [updatedVal],
                meetingDetails: [],
                meetingConfig: meetingLevelConfigRecord,
            }
        }));
        const { getByText } = render(
            <ActionCell row={row} />
        );
        jest.advanceTimersByTime(500);
        expect(getByText(/Sign In/i)).toBeTruthy();
    })
});
