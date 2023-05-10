import { Platform } from 'react-native';
import { Interval, DateTime } from 'luxon';

export const isIphone =
  typeof Platform.isPad === 'undefined' ? false : !Platform.isPad;

export const getPicklistValuesByObjectName = (picklistValues, objectName) => {
  if (picklistValues && picklistValues[objectName]) {
    return picklistValues[objectName].map((name) => ({
      label: name,
      value: name,
    }));
  } else {
    return [];
  }
};

export const isValidPlanCycleDate = ({ OCE__PlanCycle__r }) => {
  const {
    OCE__EmployeeReviewEndDate__c,
    OCE__EmployeeReviewStartDate__c,
    OCE__EndDate__c,
    OCE__StartDate__c,
    OCE__ManagerReviewEndDate__c,
    OCE__ManagerReviewStartDate__c,
  } = OCE__PlanCycle__r;

  const planInterval = Interval.fromDateTimes(
    DateTime.fromISO(OCE__StartDate__c),
    DateTime.fromISO(OCE__EndDate__c)
  );

  // validate today, if today is in plan dates range
  const isValidTodayDate = planInterval.contains(DateTime.now());

  let isValidReviewDates;

  // if reviews dates are exist than validate if they are in plan dates range
  if (
    OCE__EmployeeReviewEndDate__c &&
    OCE__EmployeeReviewStartDate__c &&
    OCE__ManagerReviewEndDate__c &&
    OCE__ManagerReviewStartDate__c
  ) {
    const employeeStart = DateTime.fromISO(OCE__EmployeeReviewStartDate__c);
    const employeeEnd = DateTime.fromISO(OCE__EmployeeReviewEndDate__c);
    const managerStart = DateTime.fromISO(OCE__ManagerReviewStartDate__c);
    const managerEnd = DateTime.fromISO(OCE__ManagerReviewEndDate__c);

    isValidReviewDates =
      planInterval.contains(employeeStart) &&
      planInterval.contains(employeeEnd) &&
      planInterval.contains(managerStart) &&
      planInterval.contains(managerEnd);

    return isValidTodayDate && isValidReviewDates;
  }

  // if no review dates, just check today date
  return isValidTodayDate;
};
