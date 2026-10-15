import React from 'react';
import SignFooter from './SignFooter';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../../../constants/mockData";
import { NAMESPACE } from '../../../../constants';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe('Signature Box Footer', () => {
    it('SignFooter Component should render properly', async () => {
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
        const handleClear =jest.fn();

        const { getByTestId } = render(
            <SignFooter handleClear={handleClear} />
        );
        expect(getByTestId('SignFooter')).toBeTruthy();
    })
    it('SignHeader Component with meal option checkbox for iPad should render properly', async () => {
        const updatedArr = {[`${NAMESPACE}MealFieldType__c`]: 'check' }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: [updatedArr],
            }
        }));
        const handleClear =jest.fn();

        const { getByTestId } = render(
            <SignFooter handleClear={handleClear} />
        );
        expect(getByTestId('SignFooter')).toBeTruthy();
    });
});
