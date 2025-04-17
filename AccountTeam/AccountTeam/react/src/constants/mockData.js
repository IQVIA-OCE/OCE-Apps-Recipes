import { NAMESPACE } from ".";
const customSettingsForTrue = [{ [`${NAMESPACE}DoNotUseTerritories255Field__c`]: true }];
const customSettingsForFalse = [{ [`${NAMESPACE}DoNotUseTerritories255Field__c`]: false }];
const territoryIds = [{ Territory2Id: '0MI4x0000000TLGGA2' }, { Territory2Id: '0MI4x0000000TLHGA2' }, { Territory2Id: '0MI4x0000000TLIGA2' }]
const territoryNameIds = [{ Id: '0MI4x0000000TLGGA2' }, { Id: '0MI4x0000000TLHGA2' }, { Id: '0MI4x0000000TLIGA2' }]
const territoryNames = [{ [`${NAMESPACE}Territories__c`]: ";DM - San Francisco 20D02;TM - SPC - Aurora 20A02T06;TM - SPC - Joliet 20A02T11;" }]
const teamMembers = [{
    Territory2: {
        AccountAccessLevel: "Read",
        Description: null,
        Name: "DM - San Francisco 20D02",
    },
    User: {
        City: null,
        Country: "US",
        Email: "test1@test.com",
        FirstName: "Partner",
        LastName: "Admin",
        Manager: null,
        Name: "Partner Admin",
        [`${NAMESPACE}LastSyncTime__c`]: null,
        Phone: null
    }
},
{
    Territory2: {
        AccountAccessLevel: "Edit",
        Description: null,
        Name: "TM - SPC - Aurora 20A02T06",
    },
    User: {
        City: null,
        Country: null,
        Email: "test2@test.com",
        FirstName: "Test",
        LastName: "User",
        Manager: null,
        Name: "Test User",
        [`${NAMESPACE}LastSyncTime__c`]: '2021-11-16T12:59:07.000+0000',
        Phone: "480"
    }
},
{
    Territory2: {
        AccountAccessLevel: "Edit",
        Description: null,
        Name: "TM - SPC - Aurora 20A02T06"
    },
    User: {
        City: "Chandler",
        Country: "United States",
        Email: "test3@test.com",
        FirstName: "test user 2",
        LastName: "user 2",
        Manager: null,
        Name: "test user 2",
        [`${NAMESPACE}LastSyncTime__c`]: null,
        Phone: "(480) 479-9000"
    }
}]
const searchTeamMemeberData = [
    {
        Territory2: {
            AccountAccessLevel: "Edit",
            Description: null,
            Name: "TM - SPC - Aurora 20A02T06",
        },
        User: {
            City: null,
            Country: null,
            Email: "test4@test.com",
            FirstName: "test user 1",
            LastName: "user 1",
            Manager: null,
            Name: "test user 1",
            [`${NAMESPACE}LastSyncTime__c`]: '2021-11-16T12:59:07.000+0000',
            Phone: "480"
        }
    },
    {
        Territory2: {
            AccountAccessLevel: "Edit",
            Description: null,
            Name: "TM - SPC - Aurora 20A02T06"
        },
        User: {
            City: "Chandler",
            Country: "United States",
            Email: "test4@test.com",
            FirstName: "test user 2",
            LastName: "user 2",
            Manager: null,
            Name: "test user 2",
            [`${NAMESPACE}LastSyncTime__c`]: null,
            Phone: "(480) 479-9000"
        }
    }];
const layoutData = {
    compactLayoutable: true,
    createable: true,
    custom: false,
    customSetting: false,
    deepCloneable: false,
    deletable: true,
    deprecatedAndHidden: false,
    extendedBy: null,
    extendsInterfaces: null,
    fields: [
        {
            label: "Account Access Level",
            length: 40,
            mask: null,
            maskType: null,
            name: "AccountAccessLevel",
            nameField: false,
            namePointing: false,
            nillable: false,
            permissionable: false,
            picklistValues: [
                {
                    active: true,
                    defaultValue: false,
                    label: "Read Only",
                    validFor: null,
                    value: "Read",
                },
                {
                    active: true,
                    defaultValue: false,
                    label: "Read/Write",
                    validFor: null,
                    value: "Edit",
                },
                {
                    active: true,
                    defaultValue: false,
                    label: "Owner",
                    validFor: null,
                    value: "All",
                },
            ],
        }
    ],
    implementsInterfaces: null,
    feedEnabled: false,
    queryable: true,
    defaultImplementation: null,
    labelPlural: "Meeting Members",
    networkScopeFieldName: null
};
export { territoryIds, customSettingsForTrue, customSettingsForFalse, territoryNames, teamMembers, searchTeamMemeberData, layoutData, territoryNameIds };