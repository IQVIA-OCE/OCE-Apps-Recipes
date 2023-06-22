import { NAMESPACE } from '../constants';

export const CALL_TODOS_RAW_IOS = [
  {
    Id: 'a2V0k000000lWv3EAE',
    [`${NAMESPACE}Compliance__r.Id`]: 'a2f0k0000006r0kAAA',
    [`${NAMESPACE}Compliance__r.Name`]: 'Compliance EPPV 1',
    [`${NAMESPACE}Compliance__r.${NAMESPACE}ComplianceType__c`]: 'EPPV',
    [`${NAMESPACE}IntervieweeOther__c`]: 'Other interviewee',
    [`${NAMESPACE}Interviewee__r.Id`]: '1',
    [`${NAMESPACE}Interviewee__r.Name`]: 'IS BC Contact #1',
    [`${NAMESPACE}SurveyType__c`]: 'Face To Face',
  },
];
export const CALL_TODOS_RAW_WEB = [
  {
    Id: 'a2V0k000000lWv3EAE',
    [`${NAMESPACE}Compliance__r`]: {
      Id: 'a2f0k0000006r0kAAA',
      Name: 'Compliance EPPV 1',
      [`${NAMESPACE}ComplianceType__c`]: 'EPPV',
    },
    [`${NAMESPACE}IntervieweeOther__c`]: 'Other interviewee',
    [`${NAMESPACE}Interviewee__r`]: { Id: '1', Name: 'IS BC Contact #1' },
    [`${NAMESPACE}SurveyType__c`]: 'Face To Face',
  },
];
export const CALL_TODOS_MAPPED = [
  {
    complianceId: 'a2f0k0000006r0kAAA',
    complianceName: 'Compliance EPPV 1',
    complianceType: 'EPPV',
    id: 'a2V0k000000lWv3EAE',
    intervieweeId: '1',
    intervieweeName: 'IS BC Contact #1',
    otherIntervieweeName: 'Other interviewee',
    surveyType: 'Face To Face',
  },
];
