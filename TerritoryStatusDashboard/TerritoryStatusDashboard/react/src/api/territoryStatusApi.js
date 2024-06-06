import { sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { DATA_FETCHING_PERIOD, NAMESPACE, TERRITORY, USER_ID } from '../constants';

export const fetchTerritoryAccounts = async (isPersonAccount, withPeriod) => {
  try {
    const query = `SELECT COUNT_DISTINCT(${NAMESPACE}Account__c) number\
        FROM ${NAMESPACE}AccountTerritoryFields__c\
        WHERE ${NAMESPACE}Territory__c = '${TERRITORY.name}'\
        AND ${NAMESPACE}Account__r.IsPersonAccount = ${isPersonAccount}\
        AND ${NAMESPACE}Account__c IN (
          SELECT ObjectId\
          FROM ObjectTerritory2Association\
          WHERE Object.Type = 'Account'\
          ${withPeriod ? `AND LastModifiedDate > N_DAYS_AGO:${DATA_FETCHING_PERIOD}` : ''}\
          AND Territory2.Name = '${TERRITORY.name}'
          AND Territory2.Territory2Model.State = 'Active'\
        )`
      .replace(/\s\s+/g, ' ');
    const { records, ...metadata } = await sfNetAPI.query(query);

    return records;
  } catch (error) {
    throw error;
  }
};

export const fetchChangeRequests = async (previousPeriod) => {
  try {
    const query = `SELECT COUNT(Id) number, ${NAMESPACE}Status__c status\
        FROM ${NAMESPACE}DataChange__c\
        WHERE ${NAMESPACE}Status__c IN ('Approved', 'Rejected')\
        AND CreatedById = '${USER_ID}'\
        AND CreatedDate > N_DAYS_AGO:${(previousPeriod ? 2 : 1) * DATA_FETCHING_PERIOD}\
        ${previousPeriod ? `AND CreatedDate < N_DAYS_AGO:${DATA_FETCHING_PERIOD}` : ''}\
        GROUP BY ${NAMESPACE}Status__c`
      .replace(/\s\s+/g, ' ');
    const { records, ...metadata } = await sfNetAPI.query(query);

    return records;
  } catch (error) {
    throw error;
  }
};

export const fetchNewEnrollments = async (previousPeriod) => {
  try {
    const query = `SELECT COUNT_DISTINCT(${NAMESPACE}Account__c) number\
        FROM ${NAMESPACE}MCMAccountEnrollment__c\
        WHERE CreatedDate > N_DAYS_AGO:${(previousPeriod ? 2 : 1) * DATA_FETCHING_PERIOD}\
        ${previousPeriod ? `AND CreatedDate < N_DAYS_AGO:${DATA_FETCHING_PERIOD}` : ''}\
        AND ${NAMESPACE}Account__c IN (\
          SELECT ${NAMESPACE}Account__c \
          FROM ${NAMESPACE}AccountTerritoryFields__c\
          WHERE ${NAMESPACE}Territory__c = '${TERRITORY.name}'\
          AND ${NAMESPACE}Account__r.IsPersonAccount = true\
        )\
        AND ${NAMESPACE}Account__c IN (\
          SELECT ObjectId\
          FROM ObjectTerritory2Association\
          WHERE Object.Type = 'Account'\
          AND Territory2.Name = '${TERRITORY.name}'\
          AND Territory2.Territory2Model.State = 'Active'\
        )`
      .replace(/\s\s+/g, ' ');
    const { records, ...metadata } = await sfNetAPI.query(query);

    return records;
  } catch (error) {
    throw error;
  }
};

export const fetchConnectRegistration = async (previousPeriod) => {
  try {
    const query = `SELECT COUNT_DISTINCT(AccountId) number
        FROM  User
        WHERE CreatedDate > N_DAYS_AGO:${(previousPeriod ? 2 : 1) * DATA_FETCHING_PERIOD}\
        ${previousPeriod ? `AND CreatedDate < N_DAYS_AGO:${DATA_FETCHING_PERIOD}` : ''}\
        AND AccountId IN (\
          SELECT ${NAMESPACE}Account__c \
          FROM ${NAMESPACE}AccountTerritoryFields__c\
          WHERE ${NAMESPACE}Territory__c = '${TERRITORY.name}'\
          AND ${NAMESPACE}Account__r.IsPersonAccount = true\
        )\
        AND AccountId IN (\
          SELECT ObjectId\
          FROM ObjectTerritory2Association\
          WHERE Object.Type = 'Account'\
          AND Territory2.Name = '${TERRITORY.name}'\
          AND Territory2.Territory2Model.State = 'Active'\
        )`
      .replace(/\s\s+/g, ' ');
    const { records, ...metadata } = await sfNetAPI.query(query);

    return records;
  } catch (error) {
    throw error;
  }
};

export const fetchCollectedOpt = async (previousPeriod) => {
  try {
    const query = `SELECT COUNT_DISTINCT(${NAMESPACE}Account__c) number
        FROM ${NAMESPACE}Opt__c 
        WHERE ${NAMESPACE}IsActive__c = true
        AND ${NAMESPACE}IsChannelOpt__c = false
        AND CreatedDate > N_DAYS_AGO:${(previousPeriod ? 2 : 1) * DATA_FETCHING_PERIOD}\
        ${previousPeriod ? `AND CreatedDate < N_DAYS_AGO:${DATA_FETCHING_PERIOD}` : ''}\
        AND ${NAMESPACE}Account__c IN (\
          SELECT ${NAMESPACE}Account__c \
          FROM ${NAMESPACE}AccountTerritoryFields__c\
          WHERE ${NAMESPACE}Territory__c = '${TERRITORY.name}'\
          AND ${NAMESPACE}Account__r.IsPersonAccount = true\
        )\
        AND ${NAMESPACE}Account__c IN (\
          SELECT ObjectId\
          FROM ObjectTerritory2Association\
          WHERE Object.Type = 'Account'\
          AND Territory2.Name = '${TERRITORY.name}'\
          AND Territory2.Territory2Model.State = 'Active'\
        )`
      .replace(/\s\s+/g, ' ');
    const { records, ...metadata } = await sfNetAPI.query(query);

    return records;
  } catch (error) {
    throw error;
  }
};
