import {
  AccountComplianceCycle__c,
  AccountCompliance__c,
  ToDo__c,
  NAMESPACE,
} from '../constants';
import { Platform } from 'react-native';
import { DateTime } from 'luxon';

export const normalizeToDoMobile = (compliance) => {
  return compliance.map((item) => ({
    Id: item['Id'],
    accountComplianceId: item[`${NAMESPACE}AccountCompliance__c`],
    accountComplianceCycleId: item[`${NAMESPACE}AccountComplianceCycle__c`],
    compliance:
      item[`${NAMESPACE}AccountCompliance__r.${NAMESPACE}Compliance__r.Name`],
    accountName:
      item[
        `${NAMESPACE}AccountCompliance__r.${NAMESPACE}Account__r.${NAMESPACE}AccountFullName__c`
      ],
    accountId: item[`${NAMESPACE}AccountCompliance__r.${NAMESPACE}Account__c`],
    cycle:
      item[`${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}SortOrder__c`],
    cycleStartdate:
      item[
        `${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}CycleStartDate__c`
      ],
    cycleEndDate:
      item[`${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}CycleEndDate__c`],
  }));
};

export const normalizeToDoWeb = (compliance) => {
  return compliance.map((item) => ({
    Id: item['Id'],
    accountComplianceId: item[`${NAMESPACE}AccountCompliance__c`],
    accountComplianceCycleId: item[`${NAMESPACE}AccountComplianceCycle__c`],
    compliance:
      item[`${NAMESPACE}AccountCompliance__r`][`${NAMESPACE}Compliance__r`][
        'Name'
      ],
    accountName: item[`${NAMESPACE}AccountCompliance__r`][`${NAMESPACE}Account__r`] ? 
      item[`${NAMESPACE}AccountCompliance__r`][`${NAMESPACE}Account__r`][
        `${NAMESPACE}AccountFullName__c` 
      ] : '',
    accountId: item[`${NAMESPACE}AccountCompliance__r`][`${NAMESPACE}Account__c`],
    cycle:
      item[`${NAMESPACE}AccountComplianceCycle__r`][`${NAMESPACE}SortOrder__c`],
    cycleStartdate:
      item[
        `${NAMESPACE}AccountComplianceCycle__r`
      ][`${NAMESPACE}CycleStartDate__c`],
    cycleEndDate:
      item[`${NAMESPACE}AccountComplianceCycle__r`][`${NAMESPACE}CycleEndDate__c`],
  }));
};

export const normalizeToDo = (compliance) => {
  if (Platform.OS === 'web') {
    return normalizeToDoWeb(compliance);
  }
  return normalizeToDoMobile(compliance);
};

export const normalizeUpdateValues = (sObjectsToUpdate, values) => {
  const {
    Id,
    accountComplianceId,
    accountComplianceCycleId,
    completionDate,
    otherInterviewee = null,
    interviewee = {
      value: null,
    },
    surveyType,
  } = values;

  const dt = DateTime.fromISO(completionDate);
  const completionDateISODate = dt.toISODate();

  const defaultPayload = {
    [`${ToDo__c}`]: {
      id: Id,
      [`${NAMESPACE}SurveyType__c`]: surveyType.value,
      [`${NAMESPACE}Interviewee__c`]: interviewee.value,
      [`${NAMESPACE}IntervieweeOther__c`]: otherInterviewee,
      [`${NAMESPACE}CompletionDate__c`]: completionDateISODate,
      [`${NAMESPACE}Status__c`]: 'Completed',
      sObject: `${NAMESPACE}ToDo__c`,
    },
    [`${AccountComplianceCycle__c}`]: {
      id: accountComplianceCycleId,
      [`${NAMESPACE}SurveyType__c`]: surveyType.value,
      [`${NAMESPACE}CompletionDate__c`]: completionDateISODate,
      [`${NAMESPACE}Status__c`]: 'Completed',
      sObject: `${NAMESPACE}AccountComplianceCycle__c`,
    },
    [`${AccountCompliance__c}`]: {
      id: accountComplianceId,
      [`${NAMESPACE}Status__c`]: 'Done',
      sObject: `${NAMESPACE}AccountCompliance__c`,
    },
  };

  return sObjectsToUpdate.map((val) => defaultPayload[`${val}`]);
};

export const mapAccount = (u) => ({ value: u.Id, label: u.Name });
