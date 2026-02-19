import { NAMESPACE } from "../constants";

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const SORT_BY_TEXT = 'Sort by: ';
export const SORT_COLUMN = [
  {
    label: 'Compliance',
    value: `${NAMESPACE}AccountCompliance__r.${NAMESPACE}Compliance__r.Name`,
  },
  {
    label: 'Account Name',
    value: `${NAMESPACE}AccountCompliance__r.${NAMESPACE}Account__r.${NAMESPACE}AccountFullName__c`,
  },
  {
    label: 'Cycle',
    value: `${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}SortOrder__c`,
  },
  {
    label: 'Cycle Start Date',
    value: `${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}CycleStartDate__c`,
  },
  {
    label: 'Cycle End Date',
    value: `${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}CycleEndDate__c`,
  },
];
