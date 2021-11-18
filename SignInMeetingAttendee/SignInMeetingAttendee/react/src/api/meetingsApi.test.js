import {
    fetchLayouts, fetchMeetingsInfodb, fetchMeetingsMemebersInfodb, fetchMeetingConfigdb, fetchMeetingOrgLevelConfigdb, updateMeetingMemeberDetailsdb,
    fetchAccountDetails, fetchMeetingTopics, fetchDiscrepancyPicklistValues, fetchMeetingHighLightPanel
} from "./meetingsApi";
import { api } from '../utils';
import { meetingLevelConfigRecord, meetingMemberLayout, meetingsInfo, meetingsMemebersInfo, meetingConfigData } from "../constants/mockData";
import { databaseManager } from '../../bridge/Database/DatabaseManager.native';
jest.mock('../../bridge/EnvironmentData/EnvironmentData.native', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        profileId: () => '2',
        organizationId: () => '3'
    },
}));

import { NAMESPACE } from '../constants';


describe("Meetings Info Api offline", () => {
    it("should fetch meeting details from offline database", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchMeetingsInfodb('a471s000000CcWHAA0');
        expect(spy).toHaveBeenCalled();
    });
    it("should match the meeting details for the  given meeting id", async () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(meetingsInfo));
        const data = await fetchMeetingsInfodb('a471s000000CcWHAA0');
        expect(data).toEqual(meetingsInfo);
        expect(spy).toHaveBeenCalled();

    });
    it("should fetch meeting members info from offline database", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchMeetingsMemebersInfodb('a471s000000CcWHAA0');
        expect(spy).toHaveBeenCalled();
    });
    it("should match meeting members info from offline database for the given meeting id", async () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(meetingsMemebersInfo));
        const data = await fetchMeetingsMemebersInfodb('a471s000000CcWHAA0');
        expect(data).toEqual(meetingsMemebersInfo);
        expect(spy).toHaveBeenCalled();
    });
    it("should fetch meeting config info from offline database for the given enviromental user id variable", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchMeetingConfigdb('0056F00000B45ezQAB');
        expect(spy).toHaveBeenCalled();
    });
    it("should match meeting config info from offline database for the given enviromental user id variable", async () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(meetingConfigData));
        const data = await fetchMeetingConfigdb('0056F00000B45ezQAB');
        expect(data).toEqual(meetingConfigData);
        expect(spy).toHaveBeenCalled();
    });
    it("should fetch meeting org level config info from offline database for the given enviromental user id variable", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchMeetingOrgLevelConfigdb('0056F00000B45ezQAB');
        expect(spy).toHaveBeenCalled();
    });
    it("should match meeting org level config info from offline database for the given enviromental user id variable", async () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(meetingLevelConfigRecord));
        const data = await fetchMeetingOrgLevelConfigdb('0056F00000B45ezQAB');
        expect(data).toEqual(meetingLevelConfigRecord);
        expect(spy).toHaveBeenCalled();
    });

    it("should call the method with signature data transaction 1 for existing records", () => {
        const spy = jest.spyOn(databaseManager, "upsert").mockImplementation();
        updateMeetingMemeberDetailsdb([{
            Id: "a421s000000CuyZAAS",
            [`${NAMESPACE}AttendanceStatus__c`]: "Attended-eSigned",
            [`${NAMESPACE}GeolocationCheckDateTimeOnSignature__c`]: "2021-09-16T17:54:12.415+05:30",
            [`${NAMESPACE}GeolocationMissingReasonOnSignature__c`]: "Offline",
            [`${NAMESPACE}MealOption__c`]: null,
            [`${NAMESPACE}Meal__c`]: false,
        }]);
        expect(spy).toHaveBeenCalled();
    });
    it("should update the db with signature data transaction 1 for existing records", async () => {
        const spy = jest.spyOn(databaseManager, "upsert").mockImplementation(() => Promise.resolve(['a421s000000CuyZAAS']));
        const data = await updateMeetingMemeberDetailsdb([{
            Id: "a421s000000CuyZAAS",
            [`${NAMESPACE}AttendanceStatus__c`]: "Attended-eSigned",
            [`${NAMESPACE}GeolocationCheckDateTimeOnSignature__c`]: "2021-09-16T17:54:12.415+05:30",
            [`${NAMESPACE}GeolocationMissingReasonOnSignature__c`]: "Offline",
            [`${NAMESPACE}MealOption__c`]: null,
            [`${NAMESPACE}Meal__c`]: false,
        }]);
        expect(data).toEqual(['a421s000000CuyZAAS']);
        expect(spy).toHaveBeenCalled();
    });
    it("should call the method with signature data transaction 2 for existing records", () => {
        const spy = jest.spyOn(databaseManager, "upsert").mockImplementation();
        updateMeetingMemeberDetailsdb([{
            Id: "a421s000000CuyZAAS",
            [`${NAMESPACE}SignatureDate__c`]: "2021-09-16T17:54:12.416+05:30",
            [`${NAMESPACE}Signature__c`]: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB5w",
        }]);
        expect(spy).toHaveBeenCalled();
    });
    it("should update the db with signature data transaction 2 for existing records", async () => {
        const spy = jest.spyOn(databaseManager, "upsert").mockImplementation(() => Promise.resolve(['a421s000000CuyZAAS']));
        const data = await updateMeetingMemeberDetailsdb([{
            Id: "a421s000000CuyZAAS",
            [`${NAMESPACE}SignatureDate__c`]: "2021-09-16T17:54:12.416+05:30",
            [`${NAMESPACE}Signature__c`]: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB5w",
        }]);
        expect(data).toEqual(['a421s000000CuyZAAS']);
        expect(spy).toHaveBeenCalled();
    });

    it("should call the method for fetching account details for the meetingmember", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchAccountDetails('0010k00001733xKAAQ');
        expect(spy).toHaveBeenCalled();
    });


    it("should fetch account details for the meeting member", async () => {
        meetingsMemebersInfo.accountDetails = [{
            Id: "0010k00001733xKAAQ",
            [`${NAMESPACE}AllowRestrictedProducts__c`]: 0,
            [`${NAMESPACE}RestrictedProductsJSON__c`]: null,
            [`${NAMESPACE}TerritoryRestrictedProductsJSON__c`]: null,
            uid: "0010k00001733xKAAQ",
        }]
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(meetingsMemebersInfo));
        const data = await fetchAccountDetails('0010k00001733xKAAQ');
        expect(data).toEqual(meetingsMemebersInfo);
        expect(spy).toHaveBeenCalled();
    });

    it("should call the method for fetching meetingtopics  for the meeting", () => {
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
        fetchMeetingTopics('a470k0000010B6GAAU');
        expect(spy).toHaveBeenCalled();
    });


    it("should fetch meeting topics details for the meeting member", async () => {
        // const meetingTopicsProducts = [{
        //     Id: "a6c0k000004OaP8AAK",
        //     Name: "TP-000000",
        //     OCE__Topic__c: "a6d0k0000005lscAAA",
        //     uid: "a6c0k000004OaP8AAK",
        // }]
        const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve([]));
        const data = await fetchMeetingTopics('a470k0000010B6GAAU');
        expect(data).toEqual([]);
        expect(spy).toHaveBeenCalled();
    });


    // it("should call the method for fetching meetingtopics products for the meeting", () => {
    //     const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    //     const meetingTopics = [{
    //         records: [{
    //             Id: "a450k000000HeNrAAK",
    //             [`${NAMESPACE}Topic__c`]: "a6d0k0000005lscAAA",
    //             uid: "a450k000000HeNrAAK"
    //         }]
    //     }];
    //     topicProductForMeeting(meetingTopics);
    //     expect(spy).toHaveBeenCalled();
    // });


    // it("should fetch meeting topics product details for the meeting member", async () => {
    //     const meetingTopics = [{
    //         records: [{
    //             Id: "a450k000000HeNrAAK",
    //             [`${NAMESPACE}Topic__c`]: "a6d0k0000005lscAAA",
    //             uid: "a450k000000HeNrAAK"
    //         }]
    //     }];
    //     const meetingTopicsProducts = [{
    //         Id: "a6c0k000004OaP8AAK",
    //         Name: "TP-000000",
    //         OCE__Topic__c: "a6d0k0000005lscAAA",
    //         uid: "a6c0k000004OaP8AAK",
    //     }]
    //     const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve(meetingTopicsProducts));
    //     const data = await topicProductForMeeting(meetingTopics);
    //     expect(data).toEqual(meetingTopicsProducts);
    //     expect(spy).toHaveBeenCalled();
    // });

});

describe("Meetings layout Api", () => {
    it("should fetch meeting member object layout", () => {
        const spy = jest.spyOn(api, "describe").mockImplementation();
        fetchLayouts(`${NAMESPACE}MeetingMember__c`);
        expect(spy).toHaveBeenCalled();
    });
    it("should match meeting member object layout", async () => {
        const spy = jest.spyOn(api, "describe").mockImplementation(() => Promise.resolve(meetingMemberLayout));
        const data = await fetchLayouts(`${NAMESPACE}MeetingMember__c`);
        expect(data).toEqual(meetingMemberLayout);
        expect(spy).toHaveBeenCalled();
    });

    it("should match meeting member discrepency pick listvalues", async () => {
        const recordTypeObj = [{
            buttonLayoutSection: { detailButtons: [] },
            detailLayoutSections: [],
            editLayoutSections: [],
            feedView: null,
            highlightsPanelLayoutSection: null,
            id: "00h0k000000k5NkAAI",
            multirowEditLayoutSections: [],
            offlineLinks: [],
            quickActionList: { quickActionListItems: [] },
            relatedContent: null,
            relatedLists: [],
            saveOptions: [],
        }];
        const spy = jest.spyOn(api, "describeLayout").mockImplementation(() => Promise.resolve(recordTypeObj));
        const data = await fetchDiscrepancyPicklistValues(`${NAMESPACE}MeetingMember__c`, '0120k000000GlNlAAK');
        expect(data).toEqual(recordTypeObj);
        expect(spy).toHaveBeenCalled();
    });


    it("should match meeting highlight panel values", async () => {
        const recordTypeObj = [{
            actions: null,
            fieldItems: [],
            id: "0AH0k000000CspjGAC",
            imageItems: null,
            label: "Summary",
            name: [`${NAMESPACE}Summary`],
            objectType: [`${NAMESPACE}Meeting__c`],
        }];
        const spy = jest.spyOn(api, "retrieve").mockImplementation(() => Promise.resolve(recordTypeObj));
        const data = await fetchMeetingHighLightPanel(`${NAMESPACE}Meeting__c`, 'describe/compactLayouts/0120k000000GlNlAAK');
        expect(data).toEqual(recordTypeObj);
        expect(spy).toHaveBeenCalled();
    });
});
