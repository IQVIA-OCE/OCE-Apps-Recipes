import React from 'react';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord, meetingConfigData } from "../../constants/mockData";
import CustomiPhoneCell from './CustomiPhoneCell';
import { NAMESPACE } from '../../constants';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('CustomiPhone cell Component', () => {
    it('Action Cell should render properly for iPhone', async () => {
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
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingGenConfig: meetingConfigData,
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord
            }
        }));
        const { getByText } = render(
            <CustomiPhoneCell row={row} />
        );
        expect(getByText(/Test set/i)).toBeTruthy();
    })

    it('Sign in icon should be enabled in iPhone', async () => {
        const row = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
            OCE__AddressText__c: null,
            OCE__AttendanceStatus__c: "Attended-eSigned",
            OCE__SignatureDate__c: null,
            OCE__SpecialtyText__c: null,
            validateRestrictedFields: jest.fn()
        }
        const updatedVal = { ...meetingConfigData[0], [`${NAMESPACE}IsEnabledSignInDateValidation__c`]: 0, [`${NAMESPACE}EnableConsent__c`]: 0 }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingGenConfig: [updatedVal],
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord
            }
        }));
        const { getByText } = render(
            <CustomiPhoneCell row={row} />
        );
        expect(getByText(/Test set/i)).toBeTruthy();
    })
});
