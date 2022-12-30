import { mapProducts, mapAccounts } from './mapRecords';

import { NAMESPACE } from '../constants';

const data = {
    records: [{
        [`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`]: "0016s00000OYmXsAAL",
        [`${NAMESPACE}limitData__c`]: "{\"Products\":{\"a4J6g000000gHESEA2\":{\"repLimit\":100,\r\n\"remaining\":85,\r\n\"quota\":90,\r\n\"name\":\"ADRAVIL TAB 10 MG Phy - SG\",\r\n\"minCallLimit\":5,\r\n\"maxCallLimit\":20,\r\n\"managerLimit\":100,\r\n\"hqLimit\":150,\r\n\"disbursed\":5}}}",
        'recordtype.name': 'Limit'
    }, {
        [`${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id`]: "0016s00000OWYcSAAX",
        [`${NAMESPACE}limitData__c`]: "{\"Products\":{\"a4J6g000000gHESEA2\":{\"repLimit\":100,\r\n\"remaining\":85,\r\n\"quota\":90,\r\n\"name\":\"ADRAVIL TAB 10 MG Phy - SG\",\r\n\"managerLimit\":100,\r\n\"hqLimit\":150,\r\n\"disbursed\":5}}}",
        'recordtype.name': 'Limit'
    }]
};
const account = {
    records: [{
        Id: "0016s00000OYpdFAAT",
        [`${NAMESPACE}AccountFullname__c`]: "Nik Test MP",
    }, {
        Id: "0016s00000OXSeLAAX",
        [`${NAMESPACE}AccountFullname__c`]: "Sachin Tendulkar",
    }]
}

describe('map all the products of record type Limit ', () => {

    it('it should filter the records and return a new product array for product dropdown', async () => {
        const result = mapProducts(data.records);
        expect(result).toStrictEqual([{
            value: '0016s00000OYmXsAAL',
            label: 'ADRAVIL TAB 10 MG Phy - SG',
            details: {
                disbursed: 5,
                hqLimit: 150,
                managerLimit: 100,
                maxCallLimit: 20,
                minCallLimit: 5,
                quota: 90,
                remaining: 85,
                repLimit: 100,
            }
        }, {
            value: '0016s00000OWYcSAAX',
            label: 'ADRAVIL TAB 10 MG Phy - SG',
            details: {
                disbursed: 5,
                hqLimit: 150,
                managerLimit: 100,
                maxCallLimit: 0,
                minCallLimit: 0,
                quota: 90,
                remaining: 85,
                repLimit: 100,
            }
        }]);
    });
});

describe('map all the accounts name', () => {

    it('it should filter the records and return a new account name array for account picklist', async () => {
        const result = mapAccounts(account.records);
        expect(result).toStrictEqual([{
            label: "Nik Test MP",
            value: "0016s00000OYpdFAAT"
        }, {
            label: "Sachin Tendulkar",
            value: "0016s00000OXSeLAAX"
        }]);
    });
});