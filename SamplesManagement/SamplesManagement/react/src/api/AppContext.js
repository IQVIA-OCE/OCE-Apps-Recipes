import api from '../utils/api';
import { NAMESPACE } from '../constants/constants';

export const fetchUser = userId => {
  return api.query(
    `SELECT Id, Name, ${NAMESPACE}ProfileId__c FROM User WHERE Id = '${userId}'`
  );
}