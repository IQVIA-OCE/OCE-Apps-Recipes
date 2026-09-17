import { NAMESPACE } from '../../../constants/namespacePrefix';

export const groupInsightsByAccounts = insights => {
  let accounts = [];

  const accountsById = {};
  const insightsById = {};

  for (const insight of insights) {
    const id = insight.Id;
    if (!insightsById[id]) {
      insightsById[id] = {
        id: insight.Id,
        name: insight.Name,
        text: insight[`${NAMESPACE}InsightText__c`],
        parentInsightId: insight[`${NAMESPACE}ParentInsight__c`],
      };
    }

    const accountId = insight[`${NAMESPACE}InsightAccount__r.Id`];
    if (!accountsById[accountId]) {
      accountsById[accountId] = {
        id: accountId,
        name: insight[`${NAMESPACE}InsightAccount__r.Name`],
      };
    }
  }

  for (const insight of insights) {
    const accountId = insight[`${NAMESPACE}InsightAccount__r.Id`];
    const insightId = insight.Id;

    if (!accountsById[accountId].insightsById) accountsById[accountId].insightsById = {};

    if (!accountsById[accountId].insightsById[insightsById]) {
      accountsById[accountId].insightsById[insightId] = insightsById[insightId];
    }
  }

  accounts = Object.values(accountsById).map(({ insightsById: _insightsById, ...a }) => {
    return {
      ...a,
      insights: Object.values(_insightsById),
    };
  });

  return accounts;
};
