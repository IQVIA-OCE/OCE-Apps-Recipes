import React from 'react';
import { NAMESPACE } from '../../../constants';
import SignBoxiPhoneHeader from './SignBoxiPhoneHeader';
import { fireEvent, render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../../constants/mockData";
import { Checkbox, Select } from '@oce-apps/apollo-react-native';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

const mockUseRef = (obj) => () => Object.defineProperty({}, 'current', {
    get: () => obj,
    set: () => { }
})

describe('Signature Box Header for iPhone', () => {
    it('SignHeader Component with picklist selectbox for iPhone should render properly', async () => {
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: meetingLevelConfigRecord,
                meetingLayouts: {
                    fields: [{
                        name: `${NAMESPACE}MealOption__c`,
                        label: 'Lunch',
                    },
                    {
                        name: `${NAMESPACE}Mealcheck__c`,
                        label: 'Dinner',
                    }]
                }
            }
        }));
        const { getByTestId, UNSAFE_getByType } = render(
            <SignBoxiPhoneHeader />
        );

        expect(getByTestId('Select')).toBeTruthy();
        UNSAFE_getByType(Select).props.onChange({ label: 'All', value: 'All' })
    })
    it('SignHeader Component with meal option checkbox for iPhone should render properly', async () => {
        const updatedArr = { ...meetingLevelConfigRecord, [`${NAMESPACE}MealFieldType__c`]: 'check' }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: [updatedArr],
            }
        }));
        const { getByTestId, UNSAFE_getByType } = render(
            <SignBoxiPhoneHeader />
        );
        UNSAFE_getByType(Checkbox).props.onChange(true)
        expect(getByTestId('Checkbox')).toBeTruthy();
    })
});
