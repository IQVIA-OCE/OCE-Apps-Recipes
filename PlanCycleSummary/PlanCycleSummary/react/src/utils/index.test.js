import {
  calculateWorkingHoursByEachDay,
  calculateWeekDays,
  calculateWorkingHours,
  calculateTimeOffHours,
  calculateTotalWorkingDays,
  calculateOverlapHours,
  truncateToOneDecimal,
  clamp,
  calculateCycleConcluded,
} from './index';
import { NAMESPACE } from '../constants';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: jest.fn(() => 'OCE__'),
    territory: jest.fn(() => ({ name: 'Mocked Territory' })),
    timeZone: jest.fn(() => 'Europe/Warsaw'),
  },
}));

describe('utils', () => {
  describe('calculateWorkingHoursByEachDay', () => {
    test('should return correct working hours for each day with valid start and end times', () => {
      const config = {
        MondayStartTime: '2024-03-21T08:00:00',
        MondayEndTime: '2024-03-21T17:00:00',
        TuesdayStartTime: '2024-03-22T09:00:00',
        TuesdayEndTime: '2024-03-22T18:00:00',
        WednesdayStartTime: '2024-03-23T08:30:00',
        WednesdayEndTime: '2024-03-23T16:30:00',
        ThursdayStartTime: '2024-03-24T08:00:00',
        ThursdayEndTime: '2024-03-24T17:00:00',
        FridayStartTime: '2024-03-25T07:00:00',
        FridayEndTime: '2024-03-25T16:00:00',
        SaturdayStartTime: '2024-03-26T10:00:00',
        SaturdayEndTime: '2024-03-26T15:00:00',
        SundayStartTime: '2024-03-27T11:00:00',
        SundayEndTime: '2024-03-27T16:00:00',
      };

      const expected = {
        monday: 9,
        tuesday: 9,
        wednesday: 8,
        thursday: 9,
        friday: 9,
        saturday: 5,
        sunday: 5,
      };

      expect(calculateWorkingHoursByEachDay(config)).toEqual(expected);
    });

    test('should return 0 working hours for each day with missing start or end times', () => {
      const config = {
        MondayStartTime: null,
        MondayEndTime: '2024-03-21T17:00:00',
        TuesdayStartTime: '2024-03-22T09:00:00',
        TuesdayEndTime: null,
        WednesdayStartTime: '2024-03-23T08:30:00',
        WednesdayEndTime: '2024-03-23T16:30:00',
        ThursdayStartTime: null,
        ThursdayEndTime: null,
        FridayStartTime: '2024-03-25T07:00:00',
        FridayEndTime: null,
        SaturdayStartTime: null,
        SaturdayEndTime: null,
        SundayStartTime: null,
        SundayEndTime: null,
      };

      const expected = {
        monday: 0,
        tuesday: 0,
        wednesday: 8,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      };

      expect(calculateWorkingHoursByEachDay(config)).toEqual(expected);
    });
  });

  describe('calculateWeekDays', () => {
    test('should correctly count weekdays between two dates', () => {
      const startDate = '2024-03-21';
      const endDate = '2024-03-31';

      const expected = {
        thursday: 2,
        friday: 2,
        saturday: 2,
        sunday: 2,
        monday: 1,
        tuesday: 1,
        wednesday: 1,
      };

      expect(calculateWeekDays(startDate, endDate)).toEqual(expected);
    });

    test('should handle cases where start date and end date are the same', () => {
      const startDate = '2024-03-21';
      const endDate = '2024-03-21';

      const expected = {
        thursday: 1,
      };

      expect(calculateWeekDays(startDate, endDate)).toEqual(expected);
    });
  });

  describe('calculateWorkingHours', () => {
    test('should correctly calculate total working hours for given working days and counts', () => {
      const workingDaysHours = {
        monday: 8,
        tuesday: 8,
        wednesday: 8,
        thursday: 8,
        friday: 8,
        saturday: 0,
        sunday: 0,
      };

      const daysCount = {
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 0,
        sunday: 0,
      };

      const expected = 40;

      expect(calculateWorkingHours(workingDaysHours, daysCount)).toEqual(expected);
    });

    test('should return 0 if no working days or counts are provided', () => {
      const workingDaysHours = {};
      const daysCount = {};

      const expected = 0;

      expect(calculateWorkingHours(workingDaysHours, daysCount)).toEqual(expected);
    });
  });

  describe('calculateTimeOffHours', () => {
    const hoursInWorkDay = 8;
    const planCycleStartDateISO = '2024-03-26T00:00:00.000+01:00';
    const planCycleEndDateISO = '2024-04-12T00:00:00.000+02:00';

    test('should correctly calculate total time off hours with "Days" method', () => {
      const timeOffRecords = [
        {
          [`${NAMESPACE}SpanType__c`]: 'Days',
          [`${NAMESPACE}Value__c`]: 2,
          [`${NAMESPACE}StartDate__c`]: '2024-04-03T08:07:34.421Z',
          [`${NAMESPACE}EndDate__c`]: '2024-04-03T08:07:34.421Z',
        },
        {
          [`${NAMESPACE}SpanType__c`]: 'Days',
          [`${NAMESPACE}Value__c`]: 1,
          [`${NAMESPACE}StartDate__c`]: '2024-04-01T08:07:34.421Z',
          [`${NAMESPACE}EndDate__c`]: '2024-04-02T08:07:34.421Z',
        },
      ];
      const config = { method: `${NAMESPACE}SpanType__c`, value: `${NAMESPACE}Value__c` };

      const expected = 24;

      expect(
        calculateTimeOffHours(timeOffRecords, config, hoursInWorkDay, planCycleStartDateISO, planCycleEndDateISO)
      ).toEqual(expected);
    });

    test('should correctly calculate total time off hours with "Hours" method', () => {
      const timeOffRecords = [
        {
          [`${NAMESPACE}SpanType__c`]: 'Hours',
          [`${NAMESPACE}Value__c`]: 16,
          [`${NAMESPACE}StartDate__c`]: '2024-04-03T08:07:34.421Z',
          [`${NAMESPACE}EndDate__c`]: '2024-04-03T08:07:34.421Z',
        },
        {
          [`${NAMESPACE}SpanType__c`]: 'Hours',
          [`${NAMESPACE}Value__c`]: 8,
          [`${NAMESPACE}StartDate__c`]: '2024-04-01T08:07:34.421Z',
          [`${NAMESPACE}EndDate__c`]: '2024-04-02T08:07:34.421Z',
        },
      ];
      const config = { method: `${NAMESPACE}SpanType__c`, value: `${NAMESPACE}Value__c` };

      const expected = 24;

      expect(
        calculateTimeOffHours(timeOffRecords, config, hoursInWorkDay, planCycleStartDateISO, planCycleEndDateISO)
      ).toEqual(expected);
    });

    test('should correctly calculate total time off hours with "Slot" method', () => {
      const timeOffRecords = [
        { [`${NAMESPACE}StartDate__c`]: '2024-03-21T10:00:00', [`${NAMESPACE}EndDate__c`]: '2024-03-21T12:00:00' },
        { [`${NAMESPACE}StartDate__c`]: '2024-03-22T13:00:00', [`${NAMESPACE}EndDate__c`]: '2024-03-22T17:00:00' },
      ];
      const config = { method: `${NAMESPACE}Slot__c` };

      const expected = 6;

      expect(
        calculateTimeOffHours(timeOffRecords, config, hoursInWorkDay, planCycleStartDateISO, planCycleEndDateISO)
      ).toEqual(expected);
    });

    test('should correctly calculate timeoff hours when TOTs starting or ending outside the plan cycle', () => {
      const timeOffRecords = [
        {
          [`${NAMESPACE}EndDate__c`]: '2024-04-05T00:00:00.000+02:00',
          [`${NAMESPACE}SpanType__c`]: 'Days',
          [`${NAMESPACE}StartDate__c`]: '2024-04-02T00:00:00.000+02:00',
          [`${NAMESPACE}TimeOff__c`]: 3,
          [`${NAMESPACE}Type__c`]: 'Training',
        },
        {
          [`${NAMESPACE}EndDate__c`]: '2024-04-13T00:00:00.000+02:00',
          [`${NAMESPACE}SpanType__c`]: 'Days',
          [`${NAMESPACE}StartDate__c`]: '2024-04-11T00:00:00.000+02:00',
          [`${NAMESPACE}TimeOff__c`]: 2,
          [`${NAMESPACE}Type__c`]: 'Holiday',
        },
        {
          [`${NAMESPACE}EndDate__c`]: '2024-03-27T00:00:00.000+01:00',
          [`${NAMESPACE}SpanType__c`]: 'Days',
          [`${NAMESPACE}StartDate__c`]: '2024-03-25T00:00:00.000+01:00',
          [`${NAMESPACE}TimeOff__c`]: 2,
          [`${NAMESPACE}Type__c`]: 'Civic Activity',
        },
      ];
      const config = { method: `${NAMESPACE}SpanType__c`, value: `${NAMESPACE}TimeOff__c` };

      const expected = 48;

      expect(
        calculateTimeOffHours(timeOffRecords, config, hoursInWorkDay, planCycleStartDateISO, planCycleEndDateISO)
      ).toEqual(expected);
    });
  });

  describe('calculateTotalWorkingDays', () => {
    test('should correctly calculate total working days', () => {
      const workingHours = 160;
      const holidayHours = 24;
      const finalTimeOffHours = 16;
      const hoursInWorkDay = 8;

      const expected = 15;

      expect(calculateTotalWorkingDays(workingHours, holidayHours, finalTimeOffHours, hoursInWorkDay)).toEqual(
        expected
      );
    });
  });

  describe('calculateOverlapHours', () => {
    test('should correctly calculate overlap hours when there is overlap', () => {
      const tots = [{ start: '2024-03-21T08:00:00', end: '2024-03-21T12:00:00' }];

      const holidays = [{ [`${NAMESPACE}Date__c`]: '2024-03-21' }];

      const businessHours = {
        ThursdayStartTime: '09:00:00',
        ThursdayEndTime: '17:00:00',
      };

      const totSettings = { start: 'start', end: 'end' };

      const expected = 3;

      expect(calculateOverlapHours(tots, holidays, businessHours, totSettings)).toEqual(expected);
    });
  });

  describe('truncateToOneDecimal', () => {
    test('should truncate number to one decimal place', () => {
      expect(truncateToOneDecimal(3.456)).toBe(3.4);
      expect(truncateToOneDecimal(10)).toBe(10);
      expect(truncateToOneDecimal(0)).toBe(0);
    });

    test('should return the same number if it has no decimal part', () => {
      expect(truncateToOneDecimal(5)).toBe(5);
      expect(truncateToOneDecimal(100)).toBe(100);
    });
  });

  describe('clamp', () => {
    test('should clamp the value within the specified range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    test('should return min value if value is less than min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-15, -10, 10)).toBe(-10);
    });

    test('should return max value if value is greater than max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(20, 0, 10)).toBe(10);
    });
  });

  describe('calculateCycleConcluded', () => {
    test('should return 100 if workedDays is greater than or equal to workingDays', () => {
      expect(calculateCycleConcluded(10, 10)).toBe(100);
      expect(calculateCycleConcluded(5, 5)).toBe(100);
      expect(calculateCycleConcluded(8, 10)).toBe(100);
    });

    test('should calculate the percentage of workedDays out of workingDays', () => {
      expect(calculateCycleConcluded(10, 5)).toBe(50);
      expect(calculateCycleConcluded(20, 15)).toBe(75);
      expect(calculateCycleConcluded(8, 4)).toBe(50);
    });
  });
});
