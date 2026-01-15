import { NAMESPACE } from '../constants';
import { api } from '../utils';
import { databaseManager } from '@oce-apps/oce-apps-bridges';


/*
Below Methods are using for fetching data from offline db with the help of databasemanager bridge
Currently, database manager bridge is not supporing subqueries. We may have to merge "fetchMeetingsInfodb" and "fetchMeetingsMemebersInfodb"
into single method once this feature is available in mobile.
*/
export const fetchMeetingsInfodb = async (parentId) => {
    let clause = `Id='${parentId}'`;
    const isOfflineId = parentId.split('-').includes('oce__meeting__c');
    if (isOfflineId) {
        clause = `${NAMESPACE}offlineuniqueid__c='${parentId}'`;
    }
    return databaseManager.fetch(`SELECT Id,CreatedById,RecordTypeId,RecordType.Name,CreatedDate,CreatedBy.Name,Name,${NAMESPACE}Location__c,${NAMESPACE}Topic__c,${NAMESPACE}EndDateTime__c,${NAMESPACE}StartDateTime__c,${NAMESPACE}Status__c,${NAMESPACE}Territories__c FROM ${NAMESPACE}Meeting__c where ${clause}`);
};

export const fetchMeetingsMemebersInfodb = async (meetingId) => {
    return databaseManager.fetch(`SELECT Id,Name,${NAMESPACE}AddressText__c,${NAMESPACE}MealOption__c,${NAMESPACE}Meal__c,${NAMESPACE}AttendeeType__c,${NAMESPACE}SpecialtyText__c,${NAMESPACE}SignatureDate__c,RecordTypeId,${NAMESPACE}DiscrepancyReason__c,${NAMESPACE}AttendanceStatus__c,${NAMESPACE}Status__c, ${NAMESPACE}Customer__c FROM ${NAMESPACE}MeetingMember__c where ${NAMESPACE}Meeting__c='${meetingId}'`);
};

export const fetchAccountDetails = async (accountId) => {
    return databaseManager.fetch(`SELECT Id,${NAMESPACE}RestrictedProductsJSON__c, ${NAMESPACE}TerritoryRestrictedProductsJSON__c,${NAMESPACE}AllowRestrictedProducts__c  FROM Account where Id='${accountId}'`);
};

export const fetchMeetingConfigdb = async (ownerId) => {
    return databaseManager.fetch(`SELECT ${NAMESPACE}AttendStatusesForTopicCompliance__c,${NAMESPACE}EnableConsent__c,${NAMESPACE}IsEnabledSignInDateValidation__c,${NAMESPACE}EnableWriteIns__c,${NAMESPACE}SignInAttendanceStatuses__c,${NAMESPACE}SignInInvitationStatuses__c,${NAMESPACE}ValidateDaysInPastForTopicForWalkIn__c,${NAMESPACE}ValidateDaysInPastForTopic__c,${NAMESPACE}ValidateRestrictedProductsForWalkIns__c FROM ${NAMESPACE}MeetingsConfig__c WHERE SetupOwnerId='${ownerId}'`);
}

export const fetchMeetingOrgLevelConfigdb = async (ownerId) => {
    return databaseManager.fetch(`SELECT ${NAMESPACE}MealFieldType__c FROM ${NAMESPACE}MeetingsOrgLevelConfig__c WHERE SetupOwnerId='${ownerId}'`);
};

export const updateMeetingMemeberDetailsdb = (fields) => {
    return databaseManager.upsert(fields);
};


export const fetchMeetingTopics = async (meetingId) => {
    const meetingProducts = await databaseManager.fetch(`SELECT Id,${NAMESPACE}Topic__c FROM ${NAMESPACE}MeetingTopic__c WHERE ${NAMESPACE}Meeting__c='${meetingId}'`)
    const topicProductsForMeetingArr = await topicProductForMeeting(meetingProducts);
    return topicProductsForMeetingArr;
}

export const topicProductForMeeting = async (meetingProducts) => {
    let topicProductsForMeeting = [];
    if (meetingProducts.records) {
        topicProductsForMeeting = await Promise.all(meetingProducts.records && meetingProducts.records.map(async (product) => {
            const topicProducts = await databaseManager.fetch(`SELECT Id,Name,${NAMESPACE}Topic__c FROM ${NAMESPACE}TopicProduct__c WHERE ${NAMESPACE}Topic__c='${product[`${NAMESPACE}Topic__c`]}'`);
            return topicProducts.records
        }));
    }
    return [].concat.apply([], topicProductsForMeeting);
};

export const fetchRecordTypeForWriteIn = async () => {
    return databaseManager.fetch(`select Id from recordtype where  developername='WriteIn' and sobjecttype='${NAMESPACE}MeetingMember__c'`);
}

/* End of offlinedb methods */


/*
Below Methods are using for fetching data directly from the server with the help of sfnetapi bridge
*/

export const fetchDiscrepancyPicklistValues = async (objType, recordType) => {
    return api.describeLayout(objType, recordType);
}

export const fetchLayouts = async (objType) => {
    return api.describe(objType);
}
export const fetchMeetingHighLightPanel = async (objType, param) => {
    return api.retrieve(objType, param);
}

/* End of sfnetApi bridge methods */
