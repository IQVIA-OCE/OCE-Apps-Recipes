import { NAMESPACE } from './enviroment';

export const LOADING_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  BOOTSTRAPPING: 'bootstrapping',
};

export const PAGE = {
  CALL: 'Call',
  MEETING: 'Meeting',
};

export const ENTITY = {
  ORDER: `${NAMESPACE}Order2__c`,
  INQUIRY: `${NAMESPACE}Inquiry__c`,
  STORE_CHECK: `${NAMESPACE}StoreCheck__c`,
  CALL: `${NAMESPACE}Call__c`,
};

export const DATE_TYPE = {
  DATE: 'Date',
  DATETIME: 'DateTime',
};

export const SUBMITTED_CALL_STATUS = 'Submitted';

export const WEB_BANNER_WARNING =
  'Please, reload the page to see the new data if you have created records';
