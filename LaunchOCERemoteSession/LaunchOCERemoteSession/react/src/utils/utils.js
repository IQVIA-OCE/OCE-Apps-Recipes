import { DateTime } from "luxon";
import { environment } from "oce-apps-bridges";
import { ListItemType } from "./constants";
import { NAMESPACE } from "../../App";

export const normalizeCalls = (callsData) =>
  callsData.map((el) => ({
    id: el.Id,
    name: el.Name,
    duration: el[`${NAMESPACE}Duration__c`],
    accountId: el[`${NAMESPACE}Account__c`],
    dateTime: DateTime.fromISO(el[`${NAMESPACE}CallDateTime__c`], {
      zone: environment.timeZone(),
    }).toFormat("hh:mm a"),
    endDateTime: DateTime.fromISO(el[`${NAMESPACE}EndCallDateTime__c`], {
      zone: environment.timeZone(),
    }).toFormat("hh:mm a"),
    accountName: el[`${NAMESPACE}Account__r.Name`] || el[`${NAMESPACE}Account__r`].Name,
    location: el[`${NAMESPACE}LocationName__c`],
    endDateTimeFull: DateTime.fromISO(el[`${NAMESPACE}EndCallDateTime__c`], {
      zone: environment.timeZone(),
    }),
    startDateTimeFull: DateTime.fromISO(el[`${NAMESPACE}CallDateTime__c`], {
      zone: environment.timeZone(),
    }),
    signature: el[`${NAMESPACE}Signature__c`],
    type: ListItemType.Call,
  }));

export const normalizeMeetings = (meetingsData) =>
  meetingsData.map((el) => ({
    id: el.Id,
    name: el.Name,
    dateTime: DateTime.fromISO(el[`${NAMESPACE}StartDateTime__c`], {
      zone: environment.timeZone(),
    }).toFormat("hh:mm a"),
    endDateTime: DateTime.fromISO(el[`${NAMESPACE}EndDateTime__c`], {
      zone: environment.timeZone(),
    }).toFormat("hh:mm a"),
    accountName: el.Name,
    location: el[`${NAMESPACE}Location__c`],
    endDateTimeFull: DateTime.fromISO(el[`${NAMESPACE}EndDateTime__c`], {
      zone: environment.timeZone(),
    }),
    startDateTimeFull: DateTime.fromISO(el[`${NAMESPACE}StartDateTime__c`], {
      zone: environment.timeZone(),
    }),
    type: ListItemType.Meeting,
  }));
