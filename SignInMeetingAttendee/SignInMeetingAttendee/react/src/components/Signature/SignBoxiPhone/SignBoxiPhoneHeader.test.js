import React from 'react';
import SignBoxiPhoneHeader from './SignBoxiPhoneHeader';
import renderer, { act } from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, Select } from 'apollo-react-native';
import { records, meetingLevelConfigRecord } from "../../../constants/mockData";
import { NAMESPACE } from '../../../constants';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../../../bridge/Localization/localization.native', () => ({
    localized: (_, fallback) => fallback,
}));

jest.mock('../../../../bridge/EnvironmentData/EnvironmentData.native', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        profileId: () => '2',
        organizationId: () => '3'
    },
}));


describe('Signature Box Header for iPhone', () => {
    it('SignHeader Component with picklist selectbox for iPhone should render properly', async () => {
        // let tree;
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
        const tree = renderer.create(
            <SignBoxiPhoneHeader />
        );

        await act(async () => {
            const searchComponent = tree.root.findByType(Select);
            searchComponent.props.onChange({ label: 'Dinner', value: 'Dinner' });
            jest.advanceTimersByTime(500);
        });

        expect(tree).toMatchSnapshot();
        expect(tree.toJSON().children.length).toBe(2);
    })
    it('SignHeader Component with meal option checkbox for iPhone should render properly', async () => {
        const updatedArr = { ...meetingLevelConfigRecord[0], [`${NAMESPACE}MealFieldType__c`]: 'check' }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: [updatedArr],
            }
        }));
        const tree = renderer.create(
            <SignBoxiPhoneHeader />
        );
        await act(async () => {
            const checkboxComponent = tree.root.findByType(Checkbox);
            checkboxComponent.props.onChange(true);
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    })
});
