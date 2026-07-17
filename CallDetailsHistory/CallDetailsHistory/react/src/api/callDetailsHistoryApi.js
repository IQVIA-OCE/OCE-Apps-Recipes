import { NAMESPACE } from '../constants/namespace';
import api from '../utils/api';

export const fetchAccountById = async (id) => {
  try {
    const [data] = await api.query(
      `SELECT Id, Name FROM Account WHERE Id = '${id}'`,
    );

    return data[0];
  } catch (err) {
    console.warn({ err });
  }
};

export const fetchAccounts = async (value) => {
  try {
    const [data] = await api.query(
      `SELECT Id, Name FROM Account WHERE Name != null AND Name LIKE '%${value}%' ORDER BY FirstName ASC NULLS FIRST`,
    );

    return data.map((el) => {
      return {
        label: el.Name,
        value: el.Id,
      };
    });
  } catch (err) {
    console.warn({ err });
    throw err;
  }
};

export const fetchAccountCalls = async (accountId) => {
  try {
    const [accountCalls] = await api.query(
      `SELECT Id, ${NAMESPACE}CallDateTime__c FROM ${NAMESPACE}Call__c WHERE ${NAMESPACE}Account__c = '${accountId}' AND ${NAMESPACE}Status__c = 'Submitted'`,
    );

    return accountCalls;
  } catch (err) {
    console.warn({ err });
    throw err;
  }
};

export const fetchCallDetails = async (accountCalls) => {
  try {
    const callsQueryString = accountCalls.map(el => `${NAMESPACE}Call__c = '${el.Id}'`).join(' OR ');
    const [callDetails] = await api.query(
      `SELECT Id, ${NAMESPACE}Call__c, ${NAMESPACE}CallDateTime__c, ${NAMESPACE}Product__r.Name, ${NAMESPACE}Product__r.Id FROM ${NAMESPACE}CallDetail__c WHERE ${callsQueryString}`,
    );

    return callDetails;
  } catch (err) {
    console.warn({ err });
    throw err;
  }
};
