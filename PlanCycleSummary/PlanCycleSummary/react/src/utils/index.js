import { DateTime } from 'luxon';
import { NAMESPACE } from '../constants';
import { Platform } from 'react-native';
import { environment } from '@oce-apps/oce-apps-bridges';

export const calculateWorkingHoursByEachDay = (config) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const totalHours = {};

  daysOfWeek.forEach((day) => {
    const startTime = config[`${day}StartTime`];
    const endTime = config[`${day}EndTime`];

    if (startTime && endTime) {
      const start = DateTime.fromISO(startTime);
      const end = DateTime.fromISO(endTime);

      totalHours[day.toLowerCase()] = end.diff(start, 'hours').hours;
    } else {
      totalHours[day.toLowerCase()] = 0;
    }
  });

  return totalHours;
};

export const calculateWeekDays = (startDate, endDate) => {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  const weekdayCounts = {};

  for (let date = start; date <= end; date = date.plus({ days: 1 })) {
    const weekday = date.weekdayLong.toLowerCase();

    if (weekdayCounts.hasOwnProperty(weekday)) {
      weekdayCounts[weekday]++;
    } else {
      weekdayCounts[weekday] = 1;
    }
  }

  return weekdayCounts;
};

export const calculateWorkingHours = (workingDaysHours, daysCount) => {
  let totalWorkingHours = 0;

  for (const day in daysCount) {
    totalWorkingHours += workingDaysHours[day] * daysCount[day];
  }

  return totalWorkingHours;
};

export const calculateTimeOffHours = (
  timeOffRecords,
  config,
  hoursInWorkDay,
  planCycleStartDateISO,
  planCycleEndDateISO
) => {
  const { method, value } = config;
  const planCycleStartDate = parseDateTimeWithTimeZone(planCycleStartDateISO);
  const planCycleEndDate = parseDateTimeWithTimeZone(planCycleEndDateISO).set({ hour: 24 });

  let totalHours = 0;

  timeOffRecords.forEach((record) => {
    const TOTStartDate = parseDateTimeWithTimeZone(record[`${NAMESPACE}StartDate__c`]);
    const TOTEndDate = parseDateTimeWithTimeZone(record[`${NAMESPACE}EndDate__c`]);

    const startDateDiff = TOTStartDate.diff(planCycleStartDate);
    const endDateDiff = TOTEndDate.diff(planCycleEndDate);

    const startDateDiffDays = Math.abs(Math.round(Math.min(0, startDateDiff.as('days'))));
    const endDateDiffDays = Math.abs(Math.round(Math.max(0, endDateDiff.as('days'))));

    const startDateDiffHours = Math.abs(Math.min(0, startDateDiff.as('hours')));
    const endDateDiffHours = Math.abs(Math.max(0, endDateDiff.as('hours')));

    if (method === `${NAMESPACE}SpanType__c`) {
      if (record[method] === 'Days') {
        totalHours += (Number(record[value]) - startDateDiffDays - endDateDiffDays) * hoursInWorkDay;
      } else if (record[method] === 'Hours') {
        totalHours += Number(record[value]) - startDateDiffHours - endDateDiffHours;
      }
    } else if (method === `${NAMESPACE}Slot__c` || !method) {
      if (TOTStartDate.isValid && TOTEndDate.isValid) {
        const duration = TOTEndDate.diff(TOTStartDate, 'hours').hours;
        totalHours += duration;
      }
    }
  });

  return totalHours;
};

export const calculateTotalWorkingDays = (workingHours, holidayHours, finalTimeOffHours, hoursInWorkDay) => {
  const totalWorkingHours = workingHours - (holidayHours + finalTimeOffHours);

  return totalWorkingHours / hoursInWorkDay;
};

export const calculateOverlapHours = (tots, holidays, businessHours, totSettings) => {
  let overlapHours = 0;

  tots.forEach((tot) => {
    const totStart = parseDateTimeWithTimeZone(tot[totSettings.start]);
    const totEnd = parseDateTimeWithTimeZone(tot[totSettings.end]);

    holidays.forEach((holiday) => {
      const holidayDate = resetTimeZone(holiday[`${NAMESPACE}Date__c`]);
      const holidayWeekday = holidayDate.weekdayLong;

      const holidayStartTimeISO = businessHours[holidayWeekday + 'StartTime'];
      const holidayEndTimeISO = businessHours[holidayWeekday + 'EndTime'];

      if (holidayStartTimeISO && holidayEndTimeISO) {
        const holidayStart = normalizeHolidayDateTime(holiday[`${NAMESPACE}Date__c`] + 'T' + holidayStartTimeISO)
        const holidayEnd = normalizeHolidayDateTime(holiday[`${NAMESPACE}Date__c`] + 'T' + holidayEndTimeISO);

        if (totStart < holidayEnd && totEnd > holidayStart) {
          const overlapStart = DateTime.max(totStart, holidayStart);
          const overlapEnd = DateTime.min(totEnd, holidayEnd);
          overlapHours += Math.max(0, overlapEnd.diff(overlapStart, 'hours').hours);
        }
      }
    });
  });

  return overlapHours;
};

export const getFormattedDate = (date) => {
  const dateObject = DateTime.fromISO(date);

  return `${dateObject.toLocaleString({ month: 'long' })} ${dateObject.day}`;
};

export const truncateToOneDecimal = (num) => {
  const parts = `${num}`.split('.');

  if (parts.length === 1) {
    return num;
  }

  return parseFloat(`${parts[0]}.${parts[1][0]}`);
};

export const isIphone = typeof Platform.isPad === 'undefined' ? false : !Platform.isPad;
export const isWeb = Platform.OS === 'web';

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const calculateCycleConcluded = (workingDays, workedDays) => {
  if (workedDays >= workingDays) return 100;

  return truncateToOneDecimal((workedDays / workingDays) * 100);
};

export const parseDateTimeWithTimeZone = (dateTimeISO) =>
  DateTime.fromISO(dateTimeISO, { zone: environment.timeZone() });

export const resetTimeZone = (date) => DateTime.fromISO(date).setZone('UTC', { keepLocalTime: true });

export const normalizeHolidayDateTime = (dateTime) =>
  DateTime.fromISO(dateTime, {
    zone: 'UTC',
  }).setZone(environment.timeZone(), { keepLocalTime: true });

export const dateTimeLocal = DateTime.local().setZone(environment.timeZone());

export const getDaysBetween = (startDateString, endDateString) => {
  const startDate = parseDateTimeWithTimeZone(startDateString);
  const endDate = parseDateTimeWithTimeZone(endDateString);

  return endDate.diff(startDate, 'days').days + 1;
}

export const adjustHoursWithOverlap = (overlap, holidaysPriority, TOTsPriority, timeOffHours, holidayHours) => {
  if (holidaysPriority && TOTsPriority) {
    if (holidaysPriority <= TOTsPriority) {
      timeOffHours -= overlap;
    } else {
      holidayHours -= overlap;
    }
  } else if (holidaysPriority || TOTsPriority) {
    if (holidaysPriority) {
      timeOffHours -= overlap;
    } else {
      holidayHours -= overlap;
    }
  }
}
