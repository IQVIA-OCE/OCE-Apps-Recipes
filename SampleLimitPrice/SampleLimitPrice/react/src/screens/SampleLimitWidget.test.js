import React from 'react';
import { TouchableWithoutFeedback } from "react-native";
import SampleLimitWidget from './SampleLimitWidget/SampleLimitWidget';
import renderer, { act } from 'react-test-renderer';
import { Autocomplete } from 'apollo-react-native';
import { databaseManager } from 'oce-apps-bridges';
import CustomAutoComplete from '../components/CustomAutoComplete'
import { fetchAccounts, fetchActivityPlan } from '../api/activityPlanApi';

jest.mock('oce-apps-bridges', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        profileId: () => '2',
        organizationId: () => '3'
    },
    databaseManager: {
        upsert: jest.fn(),
        fetch: jest.fn(),
        delete: jest.fn(),
    },
}));

import { NAMESPACE } from '../constants';


describe('SampleLimitWidget', () => {
    beforeAll(() => {
        jest.useFakeTimers('legacy');
    })
    it('SampleLimitWidget should render properly', async () => {
        const records = {
            records: [{
                [`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`]: "0016s00000OYmXsAAL",
                [`${NAMESPACE}limitData__c`]: '{"Products":{"a4J6g000000gK7cEAE":{"repLimit":5,"remaining":1,"quota":9,"name":"Azelastine100MG","managerLimit":4,"hqLimit":4,"disbursed":8},"a4J6g000000gK7dEAE":{"repLimit":5,"remaining":0,"quota":8,"name":"Azelastine200MG","managerLimit":4,"hqLimit":4,"disbursed":8},"a4J6g000000gK7eEAE":{"repLimit":5,"remaining":2,"quota":7,"name":"Azelastine300MG","managerLimit":4,"hqLimit":4,"disbursed":5}}}',
                'recordtype.name': 'Limit'
            }, {
                [`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`]: "0016s00000OWYcSAAX",
                [`${NAMESPACE}limitData__c`]: null,
                'recordtype.name': 'Limit'
            }]
        };
        const accRecords = {
            records: [{
                Id: "0016s00000OWox3AAD",
                [`${NAMESPACE}AccountFullname__c`]: "Will Denzer",
                uid: "0016s00000OWox3AAD"
            }]
        };
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(records));
        const accSpy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(accRecords));
        await fetchActivityPlan();
        await fetchAccounts();
        const tree = renderer.create(
            <SampleLimitWidget accountId={'0016s00000OYmXsAAL'} />
        ).toJSON();
        expect(spy).toHaveBeenCalled();
        expect(accSpy).toHaveBeenCalled();
        expect(tree).toMatchSnapshot();
    });

    it('SampleLimitWidget should render properly with error in fetching products records', () => {
        jest.spyOn(databaseManager, "fetch").mockRejectedValue("error");
        const tree = renderer.create(
            <SampleLimitWidget accountId={'0016s00000OYmXsAAL'} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
    it('Should search for a value from CustomAutoComplete component', async () => {
        const records = {
            records: [{
                Id: "0016s00000OWox3AAD",
                [`${NAMESPACE}AccountFullname__c`]: "Will Denzer",
                uid: "0016s00000OWox3AAD"
            }]
        };

        jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(records));
        const tree = renderer.create(
            <SampleLimitWidget />
        );
        await act(async () => {
            tree.root.findByType(CustomAutoComplete).props.searchItemByQuery('Will Den');
            tree.root.findByType(CustomAutoComplete).props.onSelectItem({ label: 'Will Denzer', value: '0016s00000OWox3AAD' })
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    });
    it('Should be able to tap on TouchableWithoutFeedback', async () => {
        const tree = renderer.create(
            <SampleLimitWidget />
        );
        await act(async () => {
            tree.root.findByType(TouchableWithoutFeedback).props.onPress();
            jest.advanceTimersByTime(500);
        });
        expect(tree).toMatchSnapshot();
    });

    it('should select one product from dropdown', async () => {
        const tree = renderer.create(
            <SampleLimitWidget />
        );

        await act(() => tree.root.findAllByType(Autocomplete)[0].props.onChange({
            label: "Azelastine100MG",
            value: "0016s00000OWox3AAD",
            details: {
                disbursed: 8,
                hqLimit: 4,
                managerLimit: 4,
                quota: 9,
                remaining: 1,
                repLimit: 5,
            }
        }));
        expect(tree.toJSON()).toMatchSnapshot();
    });

});
