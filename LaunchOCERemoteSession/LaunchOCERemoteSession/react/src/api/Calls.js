import { NAMESPACE } from "../../App";
import { DateTime } from "luxon";
import { environment, databaseManager } from "@oce-apps/oce-apps-bridges";

export const fetchRemoteCallsForToday = (accountId) => {
  const fromDateTimeUtc = DateTime.utc().toFormat(
    `yyyy-MM-dd'T'hh:mm:ss.'000'ZZZ`
  );
  const toDateTime = DateTime.local()
    .setZone(environment.timeZone())
    .endOf("day")
    .toString();
  const toDateTimeUtc = DateTime.fromISO(toDateTime, {
    zone: "utc",
  }).toFormat(`yyyy-MM-dd'T'hh:mm:ss.'000'ZZZ`);

  const accountFilter = accountId
    ? `AND ${NAMESPACE}Account__c = '${accountId}'`
    : "";

  return databaseManager.fetch(`SELECT Id, Name, ${NAMESPACE}Account__c, ${NAMESPACE}Account__r.Name, ${NAMESPACE}EndCallDateTime__c, ${NAMESPACE}LocationName__c, ${NAMESPACE}AccountName__c, ${NAMESPACE}Status__c, ${NAMESPACE}Duration__c, ${NAMESPACE}CallDateTime__c, ${NAMESPACE}Signature__c\
      FROM ${NAMESPACE}Call__c\
      WHERE ${NAMESPACE}Channel__c = 'Remote' AND ${NAMESPACE}Status__c = 'Draft' AND ${NAMESPACE}CallDateTime__c >= ${fromDateTimeUtc} AND ${NAMESPACE}CallDateTime__c <= ${toDateTimeUtc} ${accountFilter}\
      ORDER BY ${NAMESPACE}CallDateTime__c DESC NULLS FIRST`);
};

export const fetchRemoteMeetingsForToday = () => {
  const fromDateTimeUtc = DateTime.utc().toFormat(
    `yyyy-MM-dd'T'hh:mm:ss.'000'ZZZ`
  );
  const toDateTime = DateTime.local()
    .setZone(environment.timeZone())
    .endOf("day")
    .toString();
  const toDateTimeUtc = DateTime.fromISO(toDateTime, {
    zone: "utc",
  }).toFormat(
    `yyyy-MM-dd'T'hh:mm:ss.'000'ZZZ`
  );

  return databaseManager.fetch(
    `SELECT Id, Name, ${NAMESPACE}EndDateTime__c, ${NAMESPACE}Location__c, ${NAMESPACE}StartDateTime__c\
      FROM ${NAMESPACE}Meeting__c\
      WHERE ${NAMESPACE}RemoteMeeting__c = true AND ${NAMESPACE}Status__c = 'Draft' AND ${NAMESPACE}StartDateTime__c >= ${fromDateTimeUtc} AND ${NAMESPACE}StartDateTime__c <= ${toDateTimeUtc}\
      ORDER BY ${NAMESPACE}StartDateTime__c ASC NULLS FIRST`
  );
};

export const fetchAccounts = (value) => {
  return databaseManager.fetch(
    `SELECT Id, Name FROM Account WHERE Name != null AND Name LIKE '%${value}%' ORDER BY Name ASC NULLS FIRST`
  );
};
