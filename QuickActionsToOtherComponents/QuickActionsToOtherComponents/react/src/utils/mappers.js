import { DATE_TYPE, ENTITY, NAMESPACE } from '../constants';
import { isWeb } from './common';

export const callMapperForCall = (el) => ({
  id: el.Id,
  ownerId: el.OwnerId,
  name: el.Name,
  accountId: el[`${NAMESPACE}Account__c`],
  account: isWeb
    ? el[`${NAMESPACE}Account__r`]?.Name
    : el[`${NAMESPACE}Account__r.Name`],
  callDateTime: el[`${NAMESPACE}CallDateTime__c`],
  status: el[`${NAMESPACE}Status__c`],
});

export const ordersMapper = (data) => {
  return data.map((el) => ({
    id: el.Id,
    name: el.Name,
    date: el[`${NAMESPACE}OrderDate__c`],
    typeAndSubtype:
      el[`${NAMESPACE}Type__c`] +
      (el[`${NAMESPACE}SubType__c`]
        ? ` / ${el[`${NAMESPACE}SubType__c`]}`
        : ''),
    netAmount: el[`${NAMESPACE}NetAmount__c`],
    status: el[`${NAMESPACE}Status__c`],
    sObject: ENTITY.ORDER,
    dateType: DATE_TYPE.DATE,
  }));
};

export const inquiriesMapper = (data) => {
  return data.map((el) => ({
    id: el.Id,
    name: el.Name,
    accountId: el[`${NAMESPACE}Account__c`],
    account: isWeb
      ? el[`${NAMESPACE}Account__r`]?.Name
      : el[`${NAMESPACE}Account__r.Name`],
    type: el[`${NAMESPACE}Inquiry_Type__c`],
    priority: el[`${NAMESPACE}Priority__c`] ? 'Yes' : 'No',
    responsePreference: el[`${NAMESPACE}ResponsePreference__c`],
    sObject: ENTITY.INQUIRY,
  }));
};

export const storeCheckMapper = (data) => {
  return data.map((el) => ({
    id: el.Id,
    name: el.Name,
    dateTime: el[`${NAMESPACE}StoreCheckDateTime__c`],
    status: el[`${NAMESPACE}Status__c`],
    sObject: ENTITY.STORE_CHECK,
    dateType: DATE_TYPE.DATETIME,
  }));
};

export const meetingMapper = (el) => ({
  id: el.Id,
  name: el.Name,
});

export const callsMapperForMeeting = (data) => {
  return data.map((el) => ({
    id: el.Id,
    name: el.Name,
    accountId: el[`${NAMESPACE}Account__c`],
    account: isWeb
      ? el[`${NAMESPACE}Account__r`]?.Name
      : el[`${NAMESPACE}Account__r.Name`],
    dateTime: el[`${NAMESPACE}CallDateTime__c`],
    channel: el[`${NAMESPACE}Channel__c`],
    status: el[`${NAMESPACE}Status__c`],
    sObject: ENTITY.CALL,
    dateType: DATE_TYPE.DATETIME,
  }));
};

export const meetingAttendeesMapper = (data) => {
  return data.map((el) => ({
    id: el.Id,
    name: el.Name,
    accountId: el[`${NAMESPACE}Customer__c`],
  }));
};

export const formPickListMapper = (data) => {
  return data.map((el) => {
    if (el.active) {
      return {
        label: el.label,
        value: el.value,
      };
    }
  });
};

export const convertInquiry = (el) => ({
  [`${NAMESPACE}Account__c`]: el.account,
  [`${NAMESPACE}Call__c`]: el.call,
  [`${NAMESPACE}Email__c`]: el.email,
  [`${NAMESPACE}Fax__c`]: el.fax,
  [`${NAMESPACE}InquiryChannel__c`]: el.inquiryChanel,
  [`${NAMESPACE}Inquiry_Type__c`]: el.inquiryType,
  [`${NAMESPACE}Phone__c`]: el.phone,
  [`${NAMESPACE}Priority__c`]: el.priority,
  [`${NAMESPACE}ResponsePreference__c`]: el.responsePreference,
  [`${NAMESPACE}SpecialHandlingInstruction__c`]: el.specialHandlingInstruction,
  [`${NAMESPACE}IsSignatureCopyRequested__c`]: el.isSignatureCopyRequested,
  [`${NAMESPACE}Status__c`]: el.status,
});

export const callAttendeesMapper = (data) => {
  return data.map((el) => ({
    id: el.Id,
    accountId: el[`${NAMESPACE}Account__c`],
    account: isWeb
      ? el[`${NAMESPACE}Account__r`]?.Name
      : el[`${NAMESPACE}Account__r.Name`],
  }));
};
