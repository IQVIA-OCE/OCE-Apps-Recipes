import { sfNetAPI } from 'oce-apps-bridges';
import { NAMESPACE } from '../constants';
import { splitStringByDelimiter } from '../utils';

/**  Method to fetch TerritoryId's based on a the custom settings configured in TerritoryManagement__c
 * @param {string} accountId
*/

export const fetchTerritoryIdForAccounts = async (accountId) => {
    const { records, ...metadata } = await sfNetAPI.query(`SELECT ${NAMESPACE}DoNotUseTerritories255Field__c FROM ${NAMESPACE}TerritoryManagement__c`);
    const [customSettings] = records;
    if (customSettings[`${NAMESPACE}DoNotUseTerritories255Field__c`]) {
        return await fetchTerritoryIds(accountId);
    }
    return await fetchTerritoryIdFromName(accountId);
}

/**  Method to fetch TerritoryId's if DoNotUseTerritories255Field__c is true
 * @param {string} accountId
*/

export const fetchTerritoryIds = async (accountId) => {
    const { records, ...metadata } = await sfNetAPI.query(`SELECT Territory2Id FROM ObjectTerritory2Association where ObjectId='${accountId}'`);
    return records;
}

/**  Method to fetch TerritoryId's if DoNotUseTerritories255Field__c is false
 * @param {string} accountId
*/

export const fetchTerritoryIdFromName = async (accountId) => {
    const { records, ...metadata } = await sfNetAPI.query(`SELECT ${NAMESPACE}Territories__c FROM Account WHERE Id='${accountId}'`);
    const [queryResult] = records;
    let territoryNames = '';

    if (queryResult && queryResult[`${NAMESPACE}Territories__c`]) {
        territoryNames = splitStringByDelimiter(queryResult[`${NAMESPACE}Territories__c`], ';');
        const { records, ...metadata } = await sfNetAPI.query(`SELECT Id FROM Territory2 WHERE Name In(${territoryNames})`);
        territoryNames = records;
    }
    return territoryNames;
}
/**  Method to fetch account team members for the given territories
 * @param {number} limit
 * @param {number} offset
 * @param {string} searchQuery
 * @param {string} territoryIds
*/

export const fetchAccountTeamMemebers = async ({ limit = 15, offset = 0, searchQuery = '', territoryIds = '', sortBy = 'User.LastName', filter = {}, order = 'ASC' }) => {
    let query = '';
    if (filter && filter['User.Name'] && filter['User.Name'].trim().length > 0) {
        query += `User.Name LIKE '%${filter['User.Name']}%' `;
    }
    if (filter && filter['Territory2.Name'] && filter['Territory2.Name'].trim().length > 0) {
        query += `${query ? 'OR' : ''} Territory2.Name LIKE '%${filter['Territory2.Name']}%' `
    }
    if (filter && filter['User.Phone'] && filter['User.Phone'].trim().length > 0) {
        query += `${query ? 'OR' : ''} User.Phone LIKE '%${filter['User.Phone']}%' `
    }
    if (filter && filter['Territory2.AccountAccessLevel'] && filter['Territory2.AccountAccessLevel'].trim().length > 0) {
        query += `${query ? 'OR' : ''} Territory2.AccountAccessLevel = '${filter['Territory2.AccountAccessLevel']}'`
    }
    if (query !== '') {
        query = `AND (${query}) `
    }

    if (searchQuery.trim().length > 0) {
        query = `${query} AND (User.Name LIKE '%${searchQuery}%' OR User.Phone LIKE '%${searchQuery}%'\
                 OR Territory2.Name LIKE '%${searchQuery}%' OR\
                  Territory2.AccountAccessLevel LIKE '%${searchQuery}%') `;
    }
    const { records, ...metadata } = await sfNetAPI.query(`SELECT User.Name,User.FirstName,User.LastName,User.Email,User.Phone,User.City,User.Country,\
    User.Manager.Name,User.${NAMESPACE}LastSyncTime__c, Territory2.Name, Territory2.AccountAccessLevel,Territory2.Description\
    FROM UserTerritory2Association WHERE IsActive = true AND Territory2Id IN (${territoryIds ? territoryIds : "''"}) ${query} ORDER BY ${sortBy} ${order}\
    LIMIT ${limit} OFFSET ${offset}`);
    return records;
}

export const fetchLayouts = async (objType) => {
    const data = await sfNetAPI.describe(objType);
    return data;
}
