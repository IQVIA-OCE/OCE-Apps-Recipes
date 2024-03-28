import { Platform } from 'react-native';
import {
  isIphone,
  getPicklistValuesByObjectName,
  isValidPlanCycleDate,
} from './helpers';
import { DateTime } from 'luxon';

describe('Helpers', () => {
  it('should return isIphone true', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      isPad: undefined,
    }));

    expect(isIphone).toBeTruthy();
  });

  it('shoud return picklist values by object name', () => {
    const picklistValues = getPicklistValuesByObjectName(
      {
        ObjectName: ['test1', 'test2'],
      },
      'ObjectName'
    );

    expect(picklistValues).toEqual([
      { label: 'test1', value: 'test1' },
      { label: 'test2', value: 'test2' },
    ]);
  });

  it('shoud return empty array', () => {
    const picklistValues = getPicklistValuesByObjectName();

    expect(picklistValues).toEqual([]);
  });

  it('shoud return validation value true', () => {
    const OCE__PlanCycle__r = {
      OCE__EmployeeReviewEndDate__c: '2021-11-20',
      OCE__EmployeeReviewStartDate__c: '2021-11-11',
      OCE__EndDate__c: DateTime.now().plus({ years: 1 }).toFormat('yyyy-MM-dd'),
      OCE__StartDate__c: '2021-10-21',
      OCE__ManagerReviewEndDate__c: '2021-11-20',
      OCE__ManagerReviewStartDate__c: '2021-11-11'
    };
    const validatedValue = isValidPlanCycleDate({ OCE__PlanCycle__r });
    expect(validatedValue).toEqual(true);
  });

  it('shoud return validation value false', () => {
    const OCE__PlanCycle__r = {
      OCE__EmployeeReviewEndDate__c: '2021-11-20',
      OCE__EmployeeReviewStartDate__c: '2021-11-11',
      OCE__EndDate__c: DateTime.now().plus({ years: 1 }).toFormat('yyyy-MM-dd'),
      OCE__StartDate__c: '2021-10-21',
      OCE__ManagerReviewEndDate__c: DateTime.now().plus({ years: 1 }).toFormat('yyyy-MM-dd'),
      OCE__ManagerReviewStartDate__c: '2021-11-11'
    };
    const validatedValue = isValidPlanCycleDate({ OCE__PlanCycle__r });
    expect(validatedValue).toEqual(false);
  });
});
