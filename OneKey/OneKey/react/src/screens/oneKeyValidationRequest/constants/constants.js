export const FORM_MAPPINGS = {
    workplace: {
        usualName: {
            oneKeyField: "Name_ims__c",
            formLabel: "Name",
        },
        parentUsualName: {
            oneKeyField: "Organization_Name_ims__c",
            formLabel: "Organization Name",
        },
        telephone: {
            oneKeyField: "Telephone_No_ims__c",
            formLabel: "Telephone No",
        },
        typeCode: {
            oneKeyField: "Workplace_Type_ims__c",
            formLabel: "Workplace Type",
        },
        category: {
            oneKeyField: "Category_ims__c",
            formLabel: "Category",
        },
    },
    address: {
        longLabel: {
            oneKeyField: "Address_Line_1_ims__c",
            formLabel: "Address Line 1",
        },
        city: {
            oneKeyField: "City_ims__c",
            formLabel: "City",
        },
        longPostalCode: {
            oneKeyField: "Postal_Code_ims__c",
            formLabel: "Postal Code",
        },
        country: {
            oneKeyField: "Country_ISO_Code_ims__c",
            formLabel: "Country",
        },
        requestComments: {
            oneKeyField: "Request_Comments_ims__c",
            formLabel: "Request Comments",
        }
    },
    individual: {
        firstName: {
            oneKeyField: "First_Name_ims__c",
            formLabel: "First Name",
        },
        middleName: {
            oneKeyField: "Middle_Name_ims__c",
            formLabel: "Middle Name",
        },
        lastName: {
            oneKeyField: "Last_Name_ims__c",
            formLabel: "Last Name",
        },
    }
}