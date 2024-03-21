import { NAMESPACE } from './environment';

export const UI_TO_SOQL_FIELD_NAMES_MAP = {
  complianceType: `${NAMESPACE}Compliance__r.${NAMESPACE}ComplianceType__c`,
  complianceName: `${NAMESPACE}Compliance__r.Name`,
  surveyType: `${NAMESPACE}SurveyType__c`,
  intervieweeName: `${NAMESPACE}Interviewee__r.Name`,
  otherIntervieweeName: `${NAMESPACE}IntervieweeOther__c`,
};

export const SORT_ORDER = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

export const SORT_ORDER_TO_SOQL_VALUES_MAP = {
  [SORT_ORDER.ASCENDING]: 'ASC',
  [SORT_ORDER.DESCENDING]: 'DESC',
};

export const ACCOUNTS_LIST_SORT_COLUMN = {
  NAME: 'Name',
  KANANAME: `${NAMESPACE}KanaName__c`,
};
