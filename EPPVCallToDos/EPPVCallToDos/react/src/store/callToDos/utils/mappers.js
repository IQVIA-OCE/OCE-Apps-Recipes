import { NAMESPACE } from '../../../constants';
import { Platform } from 'react-native';

const mapCallToDosIos = (todos) =>
  todos.map((todo) => ({
    id: todo.Id,
    complianceId: todo[`${NAMESPACE}Compliance__r.Id`],
    complianceName: todo[`${NAMESPACE}Compliance__r.Name`],
    complianceType: todo[`${NAMESPACE}Compliance__r.${NAMESPACE}ComplianceType__c`],
    surveyType: todo[`${NAMESPACE}SurveyType__c`],
    intervieweeId: todo[`${NAMESPACE}Interviewee__r.Id`],
    intervieweeName: todo[`${NAMESPACE}Interviewee__r.Name`],
    otherIntervieweeName: todo[`${NAMESPACE}IntervieweeOther__c`],
  }));

const mapCallToDosWeb = (todos) =>
  todos.map((todo) => ({
    id: todo.Id,
    complianceId: todo[`${NAMESPACE}Compliance__r`]?.Id,
    complianceName: todo[`${NAMESPACE}Compliance__r`]?.Name,
    complianceType: todo[`${NAMESPACE}Compliance__r`]?.[`${NAMESPACE}ComplianceType__c`],
    surveyType: todo[`${NAMESPACE}SurveyType__c`],
    intervieweeId: todo[`${NAMESPACE}Interviewee__r`]?.Id,
    intervieweeName: todo[`${NAMESPACE}Interviewee__r`]?.Name,
    otherIntervieweeName: todo[`${NAMESPACE}IntervieweeOther__c`],
  }));

export const mapCallToDos = (todos) => {
  if (Platform.OS === 'web') {
    return mapCallToDosWeb(todos);
  }

  return mapCallToDosIos(todos);
};

const mapCallIos = (call) => ({
  id: call.Id,
  callDateTime: call[`${NAMESPACE}CallDateTime__c`],
  accountId: call[`${NAMESPACE}Account__c`],
  account: {
    isPersonAccount: call[`${NAMESPACE}Account__r.IsPersonAccount`],
  },
  status: call[`${NAMESPACE}Status__c`],
});

const mapCallWeb = (call) => ({
  id: call.Id,
  callDateTime: call[`${NAMESPACE}CallDateTime__c`],
  accountId: call[`${NAMESPACE}Account__c`],
  account: {
    isPersonAccount: call[`${NAMESPACE}Account__r`]?.IsPersonAccount,
  },
  status: call[`${NAMESPACE}Status__c`],
});

export const mapCall = (call) => {
  if (Platform.OS === 'web') {
    return mapCallWeb(call);
  }

  return mapCallIos(call);
};
