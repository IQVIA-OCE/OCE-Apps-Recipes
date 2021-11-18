
import { mapRecordTypes, validateSignIn, validateRestrictedProducts, alertValidationType, signInDateValidation } from './helper';
import { meetingMemberLayout, meetingConfigData, singleRecordRow, records, meetingsInfo } from '../constants/mockData'
import { NAMESPACE } from '../constants';
import store from '../stores'

jest.useFakeTimers();

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../bridge/EnvironmentData/EnvironmentData.native', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        profileId: () => '2',
        organizationId: () => '3'

    },
}));

jest.mock('../stores');

const mockState = {
    meeting: { meetingGenConfig: meetingConfigData }
}

const updatedVal = { ...meetingConfigData[0], [`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`]: null }
const updatedState = {
    meeting: { meetingGenConfig: [updatedVal] }
}

describe('helper methods for the applications', () => {
    it('it should filter the records and return a new product array for product dropdown', async () => {
        const result = mapRecordTypes(meetingMemberLayout.recordTypeInfos);
        expect(result).toStrictEqual([
            {
                id: "0129D000000vAQNQA2",
                label: "Attendee",
                value: "Attendee"
            },
            {
                id: "0129D000000vAQOQA2",
                label: "Colleague",
                value: "Colleague"
            }
        ]);
    });

    it('It should validate the sign in button for all the validations', async () => {
        const isSignInEnabled = validateSignIn(meetingConfigData, records, singleRecordRow);
        expect(isSignInEnabled).toStrictEqual(false);
    })
    it('It should return null for the meeting member with no restricted products and no meetingTopics', () => {
        singleRecordRow.accountDetails = [];
        const topicProdIds = [];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual(null);
    })
    it('It should return null for the meeting member with  restricted products , meetingTopics and allowed restricted products true', () => {
        singleRecordRow.accountDetails = [{
            [`${NAMESPACE}RestrictedProductsJSON__c`]: [{ "presentationId": null, "name": "ADRAVIL", "id": "a4J6g000000gHDPEA2" }],
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: [],
            [`${NAMESPACE}AllowRestrictedProducts__c`]: true

        }];
        const topicProdIds = [];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual(null);
    })
    it('It should return empty array for the meeting member with  restricted products and no meetingTopics', () => {
        singleRecordRow.accountDetails = [{
            [`${NAMESPACE}RestrictedProductsJSON__c`]: [{ "presentationId": null, "name": "ADRAVIL", "id": "a4J6g000000gHDPEA2" }],
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: [],
            [`${NAMESPACE}AllowRestrictedProducts__c`]: false

        }];
        const topicProdIds = [];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual([]);
    })
    it('It should return restricted product array for the meeting member with  restricted products and and meetingTopics', () => {
        singleRecordRow.accountDetails = [{
            [`${NAMESPACE}RestrictedProductsJSON__c`]: [{ "presentationId": null, "name": "ADRAVIL", "id": "a4J6g000000gHDPEA2" }],
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: [],
            [`${NAMESPACE}AllowRestrictedProducts__c`]: false

        }];
        const topicProdIds = [{ Id: 'a4J6g000000gHDPEA2' }];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual([{ id: 'a4J6g000000gHDPEA2', "presentationId": null, "name": "ADRAVIL" }]);
    })
    it('It should return restricted product array for the meeting member with  territory restricted products and and meetingTopics', () => {
        singleRecordRow.accountDetails = [{
            [`${NAMESPACE}RestrictedProductsJSON__c`]: [],
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: { "records": [{ "territory": "TM - SPC - Orland Park 20A02T13", "products": [{ "presentationId": null, "name": "PROZALAND-DETAIL", "id": "a4J6g000000gHDCEA2" }] }] },
            [`${NAMESPACE}AllowRestrictedProducts__c`]: false

        }];
        records[`${NAMESPACE}Territories__c`] = ';TM - SPC - Orland Park 20A02T13;'
        const topicProdIds = [{ "Id": "a4J6g000000gHDCEA2" }];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual([{ "presentationId": null, "name": "PROZALAND-DETAIL", "id": "a4J6g000000gHDCEA2" }]);
    })
    it('It should return alert type as block for not walkin members', () => {
        store.getState = () => mockState
        const isSignInEnabled = alertValidationType(false);
        expect(isSignInEnabled).toStrictEqual('block');
    })
    it('It should return alert type as warn for not walkin members', () => {
        store.getState = () => mockState
        const isSignInEnabled = alertValidationType(true);
        expect(isSignInEnabled).toStrictEqual('warn');
    })
    it('It should fail to validate restricted products json as it is null', () => {
        store.getState = () => updatedState
        const isSignInEnabled = alertValidationType(true);
        expect(isSignInEnabled).toStrictEqual('warn');
    })
    it('It should validate the current date is within the range', () => {
        const isDateExpired = signInDateValidation(meetingsInfo);
        expect(isDateExpired).toStrictEqual(false);
    })
});