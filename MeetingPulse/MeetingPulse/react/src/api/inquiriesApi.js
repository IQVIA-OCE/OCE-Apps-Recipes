import { DateTime } from 'luxon';

import api from '../utils/api';
import { NAMESPACE } from '../constants/namespacePrefix';

export const fetchInquiryQuestions = accountIds => {
  const formattedAccountIds = accountIds.map(a => `'${a}'`).join(', ');
  const LAST_90_DAYS = DateTime.utc()
    .minus({ days: 90 })
    .startOf('day')
    .toISO();

  const query = `SELECT ${NAMESPACE}Inquiry__r.${NAMESPACE}Account__r.Name, ${NAMESPACE}Inquiry__r.${NAMESPACE}Account__r.Id, ${NAMESPACE}Inquiry__r.Name, ${NAMESPACE}Inquiry__r.Id, Id, ${NAMESPACE}Question__c, ${NAMESPACE}Inquiry__c\
    FROM ${NAMESPACE}InquiryQuestion__c\
    WHERE ${NAMESPACE}Inquiry__r.${NAMESPACE}Account__c IN (${formattedAccountIds}) AND ((LastModifiedDate >= ${LAST_90_DAYS} OR ${NAMESPACE}offlineLastModifiedDate__c >= ${LAST_90_DAYS}) OR ${NAMESPACE}Inquiry__r.LastModifiedDate >= ${LAST_90_DAYS})\
    ORDER BY ${NAMESPACE}Inquiry__r.${NAMESPACE}Account__r.Name, ${NAMESPACE}Inquiry__c, LastModifiedDate`;

  return api.queryOffline(query);
};
