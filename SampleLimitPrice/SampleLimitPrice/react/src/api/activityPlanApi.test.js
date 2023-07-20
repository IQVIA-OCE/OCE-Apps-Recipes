import {
    fetchAllActivityPlans, fetchAccounts
} from "./activityPlanApi";
import { databaseManager } from 'oce-apps-bridges';

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


describe("Activity plan Api offline", () => {
    it("should fetch limit data where activity plan is limit", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchAllActivityPlans();
        expect(spy).toHaveBeenCalled();
    });
    it("should fetch accounts from activityplan", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchAccounts();
        expect(spy).toHaveBeenCalled();
    });
    it("should match the limit data from the activity plan", async () => {
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
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve({ records: records.records, done: true, nextQueryLocator: '123' }));
        const data = await fetchAllActivityPlans();
        expect(data).toEqual(records.records);
        expect(spy).toHaveBeenCalled();
    });
    it("should match the limit data from the activity plan with query locator", async () => {
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
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve({ records: records.records, done: true, nextQueryLocator: '123' }));
        const data = await fetchAllActivityPlans('123');
        expect(data).toEqual(records.records);
        expect(spy).toHaveBeenCalled();
    });
    it("should match the account data from the activity plan", async () => {
        const records = {
            records: [{
                Id: "0016s00000OWox3AAD",
                [`${NAMESPACE}AccountFullname__c`]: "Nik Test MP",
            }, {
                Id: "0016s00000OXSeLAAX",
                [`${NAMESPACE}AccountFullname__c`]: "Sachin Tendulkar",
            }]
        };
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve({ records: records.records, done: true, nextQueryLocator: '123' }));
        const data = await fetchAccounts(null, null);
        expect(data).toEqual(records.records);
        expect(spy).toHaveBeenCalled();
    });
    it("should match the account data from the activity plan with query locatore", async () => {
        const records = {
            records: [{
                Id: "0016s00000OWox3AAD",
                [`${NAMESPACE}AccountFullname__c`]: "Nik Test MP",
            }, {
                Id: "0016s00000OXSeLAAX",
                [`${NAMESPACE}AccountFullname__c`]: "Sachin Tendulkar",
            }]
        };
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve({ records: records.records, done: true, nextQueryLocator: '123' }));
        const data = await fetchAccounts(null, '123');
        expect(data).toEqual(records.records);
        expect(spy).toHaveBeenCalled();
    });

})