import { NAMESPACE } from '../../../constants/namespacePrefix';

export const groupQuestionsByInquiriesAndAccounts = (qs = []) => {
  let accounts = [];

  const questionsById = {};
  const inquiriesById = {};
  const accountsById = {};

  for (const question of qs) {
    const id = question.Id;
    if (!questionsById[id]) {
      questionsById[id] = {
        id: question.Id,
        question: question[`${NAMESPACE}Question__c`],
      };
    }

    const inquiryId = question[`${NAMESPACE}Inquiry__c`];
    if (!inquiriesById[inquiryId]) {
      inquiriesById[inquiryId] = {
        id: question[`${NAMESPACE}Inquiry__r.Id`],
        name: question[`${NAMESPACE}Inquiry__r.Name`],
      };
    }

    const accountId = question[`${NAMESPACE}Inquiry__r.${NAMESPACE}Account__r.Id`];
    if (!accountsById[accountId]) {
      accountsById[accountId] = {
        id: accountId,
        name: question[`${NAMESPACE}Inquiry__r.${NAMESPACE}Account__r.Name`],
      };
    }
  }

  for (const question of qs) {
    const accountId = question[`${NAMESPACE}Inquiry__r.${NAMESPACE}Account__r.Id`];
    const inquiryId = question[`${NAMESPACE}Inquiry__c`];
    const questionId = question.Id;

    if (!accountsById[accountId].inquiriesById) accountsById[accountId].inquiriesById = {};

    if (!accountsById[accountId].inquiriesById[inquiryId]) {
      accountsById[accountId].inquiriesById[inquiryId] = {
        ...inquiriesById[inquiryId],
        questionsById: {},
      };
    }

    if (!accountsById[accountId].inquiriesById[inquiryId].questionsById[questionId]) {
      accountsById[accountId].inquiriesById[inquiryId].questionsById[questionId] = {
        ...questionsById[questionId],
      };
    }
  }

  accounts = Object.values(accountsById).map(({ inquiriesById: _inquiriesById, ...a }) => {
    return {
      ...a,
      inquiries: Object.values(_inquiriesById).map(({ questionsById: _questionsById, ...i }) => {
        return {
          ...i,
          questions: Object.values(_questionsById),
        };
      }),
    };
  });

  return accounts;
};
