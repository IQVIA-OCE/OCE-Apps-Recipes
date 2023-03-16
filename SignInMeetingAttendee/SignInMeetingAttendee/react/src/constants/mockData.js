import { NAMESPACE } from '../constants';

import { localized } from 'oce-apps-bridges';

const meetingLevelConfigRecord = [{
    [`${NAMESPACE}MealFieldType__c`]: "Picklist"
}];
const meetingLevelConfigRecordForcheck = [{
    [`${NAMESPACE}MealFieldType__c`]: "Check"
}];
const meetingMemberLayout = {
    mergeable: false,
    recordTypeInfos: [
        {
            urls: {
                layout: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/describe/layouts/0129D000000vAQNQA2`
            },
            master: false,
            defaultRecordTypeMapping: true,
            available: true,
            developerName: "Attendee",
            active: true,
            recordTypeId: "0129D000000vAQNQA2",
            name: "Attendee"
        },
        {
            urls: {
                layout: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/describe/layouts/0129D000000vAQOQA2`
            },
            master: false,
            defaultRecordTypeMapping: false,
            available: true,
            developerName: "Colleague",
            active: true,
            recordTypeId: "0129D000000vAQOQA2",
            name: "Colleague"
        }
    ],
    customSetting: false,
    isInterface: false,
    custom: true,
    label: "Meeting Member",
    replicateable: true,
    supportedScopes: [
        {
            name: "everything",
            label: "All meeting members"
        }
    ],
    actionOverrides: [
        {
            isAvailableInTouch: false,
            formFactor: "LARGE",
            url: null,
            pageId: "0M09D0000009clxSAA",
            name: "View"
        }
    ],
    compactLayoutable: true,
    associateParentEntity: null,
    extendsInterfaces: null,
    updateable: true,
    sobjectDescribeOption: "FULL",
    extendedBy: null,
    retrieveable: true,
    hasSubtypes: false,
    listviewable: null,
    namedLayoutInfos: [],
    implementedBy: null,
    isSubtype: false,
    associateEntityType: null,
    keyPrefix: "a42",
    undeletable: true,
    name: `${NAMESPACE}MeetingMember__c`,
    lookupLayoutable: null,
    searchLayoutable: false,
    deepCloneable: false,
    layoutable: true,
    deprecatedAndHidden: false,
    mruEnabled: false,
    createable: true,
    triggerable: true,
    fields: [
        {
            cascadeDelete: false,
            mask: null,
            createable: true,
            picklistValues: [
                {
                    defaultValue: false,
                    label: "Breakfast",
                    active: true,
                    value: "Breakfast",
                    validFor: null
                },
                {
                    defaultValue: false,
                    label: "Lunch",
                    active: true,
                    value: "Lunch",
                    validFor: null
                },
                {
                    defaultValue: false,
                    label: "Snack",
                    active: true,
                    value: "Snack",
                    validFor: null
                },
                {
                    defaultValue: false,
                    label: "Dinner",
                    active: true,
                    value: "Dinner",
                    validFor: null
                },
                {
                    defaultValue: false,
                    label: "Lunch & Snack",
                    active: true,
                    value: "Lunch & Snack",
                    validFor: null
                },
                {
                    defaultValue: false,
                    label: "Did Not Consume",
                    active: true,
                    value: "Did Not Consume",
                    validFor: null
                },
                {
                    defaultValue: false,
                    label: "Not Applicable",
                    active: true,
                    value: "Not Applicable",
                    validFor: null
                }
            ],
            referenceTo: [],
            formulaTreatNullNumberAsZero: false,
            relationshipName: null,
            restrictedDelete: false,
            soapType: "xsd:string",
            idLookup: false,
            defaultValue: null,
            inlineHelpText: null,
            maskType: null,
            custom: true,
            autoNumber: false,
            defaultedOnCreate: false,
            aggregatable: true,
            controllerName: null,
            type: "picklist",
            dependentPicklist: false,
            referenceTargetField: null,
            htmlFormatted: false,
            namePointing: false,
            filterable: true,
            aiPredictionField: false,
            digits: 0,
            length: 255,
            calculated: false,
            deprecatedAndHidden: false,
            byteLength: 765,
            precision: 0,
            name: `${NAMESPACE}MealOption__c`,
            filteredLookupInfo: null,
            displayLocationInDecimal: false,
            scale: 0,
            groupable: true,
            defaultValueFormula: null,
            compoundFieldName: null,
            polymorphicForeignKey: false,
            nillable: true,
            encrypted: false,
            restrictedPicklist: false,
            highScaleNumber: false,
            sortable: true,
            nameField: false,
            permissionable: true,
            writeRequiresMasterRead: false,
            queryByDistance: false,
            unique: false,
            extraTypeInfo: null,
            externalId: false,
            searchPrefilterable: false,
            caseSensitive: false,
            relationshipOrder: null,
            updateable: true,
            calculatedFormula: null,
            label: "Meal Option"
        },
        {
            cascadeDelete: false,
            mask: null,
            createable: true,
            picklistValues: [],
            referenceTo: [],
            formulaTreatNullNumberAsZero: false,
            relationshipName: null,
            restrictedDelete: false,
            soapType: "xsd:boolean",
            idLookup: false,
            defaultValue: false,
            inlineHelpText: "Determines if the Meeting Member requires a meal at the meeting.",
            maskType: null,
            custom: true,
            autoNumber: false,
            defaultedOnCreate: true,
            aggregatable: false,
            controllerName: null,
            type: "boolean",
            dependentPicklist: false,
            referenceTargetField: null,
            htmlFormatted: false,
            namePointing: false,
            filterable: true,
            aiPredictionField: false,
            digits: 0,
            length: 0,
            calculated: false,
            deprecatedAndHidden: false,
            byteLength: 0,
            precision: 0,
            name: `${NAMESPACE}Meal__c`,
            filteredLookupInfo: null,
            displayLocationInDecimal: false,
            scale: 0,
            groupable: true,
            defaultValueFormula: null,
            compoundFieldName: null,
            polymorphicForeignKey: false,
            nillable: false,
            encrypted: false,
            restrictedPicklist: false,
            highScaleNumber: false,
            sortable: true,
            nameField: false,
            permissionable: true,
            writeRequiresMasterRead: false,
            queryByDistance: false,
            unique: false,
            extraTypeInfo: null,
            externalId: false,
            searchPrefilterable: false,
            caseSensitive: false,
            relationshipOrder: null,
            updateable: true,
            calculatedFormula: null,
            label: "Meal?"
        }
    ],
    deletable: true,
    activateable: false,
    searchable: false,
    childRelationships: [
        {
            junctionReferenceTo: [],
            deprecatedAndHidden: false,
            childSObject: "AttachedContentDocument",
            restrictedDelete: false,
            relationshipName: "AttachedContentDocuments",
            cascadeDelete: true,
            field: "LinkedEntityId",
            junctionIdListNames: []
        }
    ],
    urls: {
        layouts: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/describe/layouts`,
        quickActions: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/quickActions`,
        sobject: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c`,
        uiNewRecord: `https://oce-pipeline-2--dcdm201002.my.salesforce.com/a42/e`,
        describe: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/describe`,
        compactLayouts: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/describe/compactLayouts`,
        approvalLayouts: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/describe/approvalLayouts`,
        uiDetailTemplate: "https://oce-pipeline-2--dcdm201002.my.salesforce.com/{ID}",
        rowTemplate: `/services/data/v50.0/sobjects/${NAMESPACE}MeetingMember__c/{ID}`,
        uiEditTemplate: "https://oce-pipeline-2--dcdm201002.my.salesforce.com/{ID}/e"
    },
    implementsInterfaces: null,
    feedEnabled: false,
    queryable: true,
    defaultImplementation: null,
    labelPlural: "Meeting Members",
    networkScopeFieldName: null
};


const meetingsInfo = [{
    CreatedBy: {
        Name: "Sales Representative PHX2"
    },
    CreatedById: "0056F00000B45efQAB",
    CreatedDate: "2021-08-24T18:35:54.000+0000",
    Id: "a470k0000010AMgAAM",
    Name: "Test1",
    [`${NAMESPACE}EndDateTime__c`]: "2021-08-31T18:35:00.000+0000",
    [`${NAMESPACE}Location__c`]: null,
    [`${NAMESPACE}StartDateTime__c`]: "2021-08-30T18:35:00.000+0000",
    [`${NAMESPACE}Status__c`]: "Draft",
    [`${NAMESPACE}Topic__c`]: null,
    RecordType: {
        Name: "Speaker Meeting"
    },
    RecordTypeId: "0120p0000012JBgAAM",
    uid: "a470k0000010AMgAAM",

}];


const meetingsMemebersInfo = [{
    Id: "a420k0000005MvUAAU",
    Name: "ASHOK KUMAR",
    [`${NAMESPACE}Address__c`]: null,
    [`${NAMESPACE}AttendanceStatus__c`]: "Attended-eSigned",
    [`${NAMESPACE}AttendeeType__c`]: null,
    [`${NAMESPACE}DiscrepancyReason__c`]: "Exceeded Monetary Caps Limit Warning",
    [`${NAMESPACE}MealOption__c`]: "Dinner",
    [`${NAMESPACE}SignatureDate__c`]: "2021-08-27T10:55:43.000+0000",
    [`${NAMESPACE}SpecialtyText__c`]: "Family medicine",
    [`${NAMESPACE}Status__c`]: "Invited",
    RecordTypeId: "0120p0000012JBOAA2",
    uid: "a420k0000005MvUAAU",
}, {
    Id: "a420k0000005Mv5AAE",
    Name: "Sales Representative PHX2",
    [`${NAMESPACE}Address__c`]: null,
    [`${NAMESPACE}AttendanceStatus__c`]: "Attended-eSigned",
    [`${NAMESPACE}AttendeeType__c`]: null,
    [`${NAMESPACE}DiscrepancyReason__c`]: null,
    [`${NAMESPACE}MealOption__c`]: null,
    [`${NAMESPACE}SignatureDate__c`]: null,
    [`${NAMESPACE}SpecialtyText__c`]: null,
    [`${NAMESPACE}Status__c`]: "Accepted",
    RecordTypeId: "0120p0000012JBPAA2",
    uid: "a420k0000005Mv5AAE",
}];

const meetingConfigData = [{
    [`${NAMESPACE}AttendStatusesForTopicCompliance__c`]: null,
    [`${NAMESPACE}EnableConsent__c`]: 1,
    [`${NAMESPACE}EnableWriteIns__c`]: 1,
    [`${NAMESPACE}IsEnabledSignInDateValidation__c`]: 1,
    [`${NAMESPACE}SignInAttendanceStatuses__c`]: null,
    [`${NAMESPACE}SignInInvitationStatuses__c`]: null,
    [`${NAMESPACE}ValidateDaysInPastForTopicForWalkIn__c`]: null,
    [`${NAMESPACE}ValidateDaysInPastForTopic__c`]: null,
    [`${NAMESPACE}ValidateRestrictedProductsForWalkIns__c`]: 'warn',

}];

const records = [{
    CreatedBy: {
        Name: "Sales Representative PHX2"
    },
    CreatedById: "0056F00000B45efQAB",
    CreatedDate: "2021-08-24T18:35:54.000+0000",
    Id: "a470k0000010AMgAAM",
    Name: "Test1",
    [`${NAMESPACE}EndDateTime__c`]: "2021-10-13T18:35:00.000+0000",
    [`${NAMESPACE}Location__c`]: 'Test Location',
    [`${NAMESPACE}StartDateTime__c`]: "2021-10-13T18:35:00.000+0000",
    [`${NAMESPACE}Status__c`]: "Draft",
    [`${NAMESPACE}Topic__c`]: null,
    ['RecordType.Name']: "Speaker Meeting",
    RecordTypeId: "0120p0000012JBgAAM",
    uid: "a470k0000010AMgAAM",
    [`${NAMESPACE}MeetingMember__r`]: {
        records: meetingsMemebersInfo
    }


}];

const singleRecordRow = {
    Id: "a421s000000CuyfAAC",
    Name: "Test A1",
    [`${NAMESPACE}Address__c`]: null,
    [`${NAMESPACE}AttendanceStatus__c`]: "Attended-eSigned",
    [`${NAMESPACE}AttendeeType__c`]: null,
    [`${NAMESPACE}DiscrepancyReason__c`]: null,
    [`${NAMESPACE}MealOption__c`]: "Dinner",
    [`${NAMESPACE}SignatureDate__c`]: "2021-09-15T10:33:45.421+05:30",
    [`${NAMESPACE}SpecialtyText__c`]: "Addiction medicine",
    [`${NAMESPACE}Status__c`]: "Invited",
    RecordTypeId: "0120k000000GlNkAAK",
    key: "a421s000000CuyfAAC",
    uid: "a421s000000CuyfAAC",

}

const meetingHighLightPanel = [{
    fieldItems: [{
        label: localized('Name', 'Meeting Name'),
        layoutComponents: [{
            type: "Field",
            value: "Name",
            details: {
                name: "Name",
                type: "string"
            }
        }]
    },
    {
        label: `${localized('Start', 'Start')}${localized('Date_time', 'Date/Time')}`,
        layoutComponents: [{
            type: `Field`,
            value: `${NAMESPACE}StartDateTime__c`,
            details: {
                name: `${NAMESPACE}StartDateTime__c`,
                type: "datetime"
            }
        }],
    },
    {
        label: `${localized('InputDateRange_EndDate_DefaultLabel', 'End')}${localized('Date_time', 'Date/Time')}`,
        layoutComponents: [{
            type: "Field",
            value: `${NAMESPACE}EndDateTime__c`,
            details: {
                name: `${NAMESPACE}EndDateTime__c`,
                type: "datetime"
            }
        }],
    },
    {
        label: `${localized('AttachmentCreatedByIdLabel', 'Created By')}`,
        layoutComponents: [
            {
                type: "Field",
                value: "CreatedById",
                details: {
                    name: "CreatedBy",
                    type: "reference",
                    relationshipName: 'CreatedBy'
                }
            },
            {
                type: "Separator",
                value: ", ",
            },
            {
                type: "Field",
                value: "CreatedDate",
                details: {
                    name: "CreatedDate",
                    type: "datetime"
                }
            },
        ],
    },
    {
        label: `${localized('Location', 'Location')}`,
        layoutComponents: [{
            type: "Field",
            value: `${NAMESPACE}Location__c`,
            details: {
                name: `${NAMESPACE}Location__c`,
                type: "string"
            }
        }],
    }]
}]

const meetingHighLight = [{
    actions: null,
    fieldItems: [{
        editableForNew: true,
        editableForUpdate: true,
        label: "Meeting Name",
        layoutComponents: [{
            displayLines: 1,
            tabOrder: 1,
            type: "Field",
            value: "Name",
            details: {
                label: "Meeting Name",
                length: 80,
                mask: null,
                maskType: null,
                name: "Name",
                type: "string",
                unique: false,
                updateable: true,
                writeRequiresMasterRead: false
            }
        }],
        placeholder: false,
        required: false,
    }, {
        editableForNew: true,
        editableForUpdate: true,
        label: "Start Date/Time",
        layoutComponents: [{
            displayLines: 1,
            tabOrder: 2,
            type: "Field",
            value: [`${NAMESPACE}StartDateTime__c`],
            details: {
                label: "Start Date/Time",
                length: 0,
                mask: null,
                maskType: null,
                name: [`${NAMESPACE}StartDateTime__c`],
                type: "datetime"
            }
        }],
        placeholder: false,
        required: false,
    }],
    id: "0AH0k000000CspjGAC",
    imageItems: null,
    label: "Summary",
    name: [`${NAMESPACE}Summary`],
    objectType: [`${NAMESPACE}Meeting__c`],
}]


export {
    records, meetingLevelConfigRecord, meetingMemberLayout,
    meetingsInfo, meetingsMemebersInfo, meetingConfigData,
    singleRecordRow, meetingHighLight, meetingHighLightPanel, meetingLevelConfigRecordForcheck
};

