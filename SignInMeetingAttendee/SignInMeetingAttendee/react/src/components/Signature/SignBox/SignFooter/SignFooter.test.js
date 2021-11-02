import React from 'react';
import { Checkbox, Select } from 'apollo-react-native';
import SignFooter from './SignFooter';
import renderer, { act } from 'react-test-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { records, meetingLevelConfigRecord } from "../../../../constants/mockData";
import { NAMESPACE } from '../../../../constants';

jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock("../../../../../bridge/Localization/localization.native");

jest.mock('../../../../../bridge/EnvironmentData/EnvironmentData.native', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        profileId: () => '2',
        organizationId: () => '3'
    },
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
        const tree = renderer.create(
            <SignFooter />
        );
        await act(async () => {
            const searchComponent = tree.root.findByType(Select);
            searchComponent.props.onChange({ label: 'Dinner', value: 'Dinner' });
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    })
    it('SignHeader Component with meal option checkbox for iPad should render properly', async () => {
        const updatedArr = { ...meetingLevelConfigRecord[0], [`${NAMESPACE}MealFieldType__c`]: 'check' }
        useDispatch.mockReturnValue(() => jest.fn());
        useSelector.mockImplementation((cb) => cb({
            meeting: {
                meetingDetails: records,
                meetingConfig: [updatedArr],
            }
        }));
        const tree = renderer.create(
            <SignFooter />
        );
        await act(async () => {
            const checkboxComponent = tree.root.findByType(Checkbox);
            checkboxComponent.props.onChange(true);
            jest.advanceTimersByTime(500);
        });
    });
});
