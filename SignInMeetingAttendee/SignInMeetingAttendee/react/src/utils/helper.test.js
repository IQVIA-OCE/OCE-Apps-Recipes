
import { mapRecordTypes, validateSignIn, validateRestrictedProducts, alertValidationType, signInDateValidation, sortSignIn, sortStrings, onValidateWriteIn } from './helper';
import { meetingMemberLayout, meetingConfigData, singleRecordRow, records, meetingsInfo } from '../constants/mockData'
import { NAMESPACE } from '../constants';
import store from '../stores'

jest.useFakeTimers();

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../stores');

const mockState = {
    meeting: { meetingGenConfig: meetingConfigData, meetingDetails: records }
}

const updatedVal = { ...meetingConfigData[0], [`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`]: 'block' }
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
            [`${NAMESPACE}RestrictedProductsJSON__c`]: '[{ "presentationId": null, "name": "ADRAVIL", "id": "a4J6g000000gHDPEA2" }]',
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: '[]',
            [`${NAMESPACE}AllowRestrictedProducts__c`]: true

        }];
        const topicProdIds = [];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual(null);
    })
    it('It should return empty array for the meeting member with  restricted products and no meetingTopics', () => {
        singleRecordRow.accountDetails = [{
            [`${NAMESPACE}RestrictedProductsJSON__c`]: '[{ "presentationId": null, "name": "ADRAVIL", "id": "a4J6g000000gHDPEA2" }]',
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: '[]',
            [`${NAMESPACE}AllowRestrictedProducts__c`]: false

        }];
        const topicProdIds = [];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual([]);
    })
    it('It should return restricted product array for the meeting member with  restricted products and and meetingTopics', () => {
        singleRecordRow.accountDetails = [{
            [`${NAMESPACE}RestrictedProductsJSON__c`]: '[{ "presentationId": null, "name": "ADRAVIL", "id": "a4J6g000000gHDPEA2" }]',
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: '[]',
            [`${NAMESPACE}AllowRestrictedProducts__c`]: false

        }];
        const topicProdIds = [{ Id: 'a4J6g000000gHDPEA2' }];
        const isSignInEnabled = validateRestrictedProducts(records, singleRecordRow, topicProdIds);
        expect(isSignInEnabled).toStrictEqual([{ id: 'a4J6g000000gHDPEA2', "presentationId": null, "name": "ADRAVIL" }]);
    })
    it('It should return restricted product array for the meeting member with  territory restricted products and and meetingTopics', () => {
        singleRecordRow.accountDetails = [{
            [`${NAMESPACE}RestrictedProductsJSON__c`]: [],
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: '{ "records": [{ "territory": "TM - SPC - Orland Park 20A02T13", "products": [{ "presentationId": null, "name": "PROZALAND-DETAIL", "id": "a4J6g000000gHDCEA2" }] }] }',
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
    it('It should  validate restricted products json for validateproductsjson warn value', () => {
        store.getState = () => updatedState
        const isSignInEnabled = alertValidationType(true);
        expect(isSignInEnabled).toStrictEqual('warn');
    })


    it('It should  validate restricted products json empty value', () => {
        const updatedStateVal = {
            meeting: {
                meetingGenConfig: [{
                    [`${NAMESPACE}AttendStatusesForTopicCompliance__c`]: null,
                    [`${NAMESPACE}EnableConsent__c`]: 1,
                    [`${NAMESPACE}EnableWriteIns__c`]: 1,
                    [`${NAMESPACE}IsEnabledSignInDateValidation__c`]: 1,
                    [`${NAMESPACE}SignInAttendanceStatuses__c`]: null,
                    [`${NAMESPACE}SignInInvitationStatuses__c`]: null,
                    [`${NAMESPACE}ValidateDaysInPastForTopicForWalkIn__c`]: null,
                    [`${NAMESPACE}ValidateDaysInPastForTopic__c`]: null,
                }]
            }
        }
        store.getState = () => updatedStateVal
        const isSignInEnabled = alertValidationType(true);
        expect(isSignInEnabled).toStrictEqual('warn');
    })

    it('It should validate the current date is within the range', () => {
        const isDateExpired = signInDateValidation(meetingsInfo);
        expect(isDateExpired).toStrictEqual(false);
    })
    it('Sort strings methods should render properly', () => {
        const rowA = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
        }
        const rowB = {
            Id: "a420k0000005NSKAA2",
            Name: "SALESREP PLAT2"
        }
        expect(sortStrings('Name', 'ascending', rowA, rowB)).toStrictEqual(1);
        expect(sortStrings('Name', 'descending', rowA, rowB)).toStrictEqual(-1);

    })
    it('Sort strings methods should render properly with empty values', () => {
        const rowA = {
            Id: "a420k0000005NTIAA2",
            Name: null,
        }
        const rowB = {
            Id: "a420k0000005NSKAA2",
            Name: "SALESREP PLAT2"
        }
        expect(sortStrings('Name', 'ascending', rowA, rowB)).toStrictEqual(-1);
        expect(sortStrings('Name', 'descending', rowA, rowB)).toStrictEqual(1);

    })
    it('Sort sign in methods should render properly without', () => {
        const rowA = {
            Id: "a420k0000005NTIAA2",
            Name: "Test set",
            [`${NAMESPACE}SignatureDate__c`]: "2021-10-11T16:29:27.000+0000",
        }
        const rowB = {
            Id: "a420k0000005NSKAA2",
            Name: "SALESREP PLAT2",
            [`${NAMESPACE}SignatureDate__c`]: "2021-10-11T16:29:14.000+0000"
        }
        expect(sortSignIn(`${NAMESPACE}SignatureDate__c`, 'ascending', rowA, rowB)).toStrictEqual(13000);
        expect(sortSignIn(`${NAMESPACE}SignatureDate__c`, 'descending', rowA, rowB)).toStrictEqual(-13000);

    })
    it('It should validate "not listed" link based on the meeting configuration', () => {
        store.getState = () => mockState
        const isWriteInEnabled = onValidateWriteIn();
        expect(isWriteInEnabled).toStrictEqual(true);
    })
});
