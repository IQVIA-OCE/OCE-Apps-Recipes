import api from '../utils/api';
import { NAMESPACE } from '../constants/namespacePrefix';
import { DateTime } from 'luxon';

export const fetchInsights = accountIds => {
  const formattedAccountIds = accountIds.map(a => `'${a}'`).join(', ');
  const LAST_90_DAYS = DateTime.utc()
    .minus({ days: 90 })
    .startOf('day')
    .toISO();

  const query = `SELECT Id, Name, ${NAMESPACE}InsightText__c, ${NAMESPACE}InsightAccount__r.Id, ${NAMESPACE}InsightAccount__r.Name, ${NAMESPACE}ParentInsight__r.Name, ${NAMESPACE}ParentInsight__c\
    FROM ${NAMESPACE}Insight__c\
    WHERE ${NAMESPACE}InsightAccount__c IN (${formattedAccountIds})\
      AND (LastModifiedDate >= ${LAST_90_DAYS} OR ${NAMESPACE}ParentInsight__r.LastModifiedDate >= ${LAST_90_DAYS})\
    ORDER BY LastModifiedDate DESC`;

  return api.queryOffline(query);
};
