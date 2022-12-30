import api from '../utils/api';

export const fetchUser = userId =>
  api.query(
    `SELECT Id, Name, OCE__ProfileId__c FROM User WHERE Id = '${userId}'`
  );