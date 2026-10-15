import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchBusinessHoursConfig,
  fetchPlanCycle,
  fetchWorkingDaysConfig,
  fetchBusinessHours,
  fetchHolidayDaysConfig,
  fetchHolidays,
  fetchHoursInWorkDay,
  fetchTimeOffDaysConfig,
  fetchTOTSettings,
  fetchTOTs,
} from '../../api';
import { NAMESPACE } from '../../constants';
import {
  calculateTimeOffHours,
  calculateWeekDays,
  calculateWorkingHours,
  calculateWorkingHoursByEachDay,
  calculateTotalWorkingDays,
  calculateOverlapHours,
  parseDateTimeWithTimeZone,
  resetTimeZone,
  adjustHoursWithOverlap,
} from '../../utils';
const { DateTime } = require('luxon');
import { dateTimeLocal } from '../../utils';

const initialState = {
  error: '',
  errorNotifications: [],
  isLoading: false,
  workingDays: 0,
  workingHours: 0,
  holidaysCount: 0,
  weekendsCount: 0,
  hoursInWorkDay: 0,
  holidayHours: 0,
  timeOffHours: 0,
  totDays: 0,
  workedDays: 0,
  daysToClose: 0,
  planCycles: [],
  selectedPlanCycle: {
    id: '',
    startDate: '',
    endDate: '',
    territory: '',
  },
  TOTs: [],
  holidays: [],
  holidaysConfig: {
    priority: 0,
  },
  TOTSettings: {
    working: [],
    config: {
      start: '',
      end: '',
      method: '',
      type: '',
      value: '',
    },
    priority: 0,
  },
  workingDaysConfig: [],
  businessHoursConfig: '',
  businessHours: {},
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setSelectedPlanCycle: (state, action) => {
      state.selectedPlanCycle = state.planCycles.find((el) => el.id === action.payload);
    },
    setWorkingHours: (state, action) => {
      state.workingHours = action.payload;
    },
    setHolidayHours: (state, action) => {
      state.holidayHours = action.payload;
    },
    setTimeOffHours: (state, action) => {
      state.timeOffHours = action.payload;
      state.totDays = action.payload / state.hoursInWorkDay;
    },
    setWorkingDays: (state, action) => {
      state.workingDays = action.payload;
    },
    setWorkedDays: (state, action) => {
      state.workedDays = action.payload;
    },
    setWeekendsCount: (state, action) => {
      state.weekendsCount = action.payload;
    },
    setDaysToClose: (state, action) => {
      state.daysToClose = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addErrorNotification: (state, action) => {
      state.errorNotifications = [...state.errorNotifications, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlanCycle.fulfilled, (state, action) => {
        state.planCycles = action.payload;
        state.selectedPlanCycle = action.payload[0];
      })
      .addCase(getPlanCycle.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getWorkingDaysConfig.fulfilled, (state, action) => {
        state.workingDaysConfig = action.payload;
      })
      .addCase(getWorkingDaysConfig.rejected, (state, action) => {
        state.errorNotifications = [
          ...state.errorNotifications,
          `Error while fetching working days config: ${action.error.message}`,
        ];
      })
      .addCase(getBusinessHoursConfig.fulfilled, (state, action) => {
        state.businessHoursConfig = action.payload;
      })
      .addCase(getBusinessHoursConfig.rejected, (state, action) => {
        state.errorNotifications = [
          ...state.errorNotifications,
          `Error while fetching business hours config: ${action.error.message}`,
        ];
      })
      .addCase(getBusinessHours.fulfilled, (state, action) => {
        state.businessHours = action.payload;
      })
      .addCase(getBusinessHours.rejected, (state, action) => {
        state.errorNotifications = [
          ...state.errorNotifications,
          `Error while fetching business hours: ${action.error.message}`,
        ];
      })
      .addCase(getHolidays.fulfilled, (state, action) => {
        state.holidaysCount = action.payload.count;
        state.holidays = action.payload.holidays;
        state.holidaysConfig.priority = action.payload.priority;
      })
      .addCase(getHolidays.rejected, (state, action) => {
        state.errorNotifications = [
          ...state.errorNotifications,
          `Error while fetching holidays: ${action.error.message}`,
        ];
      })
      .addCase(getHoursInWorkDay.fulfilled, (state, action) => {
        state.hoursInWorkDay = action.payload;
      })
      .addCase(getHoursInWorkDay.rejected, (state, action) => {
        state.errorNotifications = [
          ...state.errorNotifications,
          `Error while fetching hours in work day: ${action.error.message}`,
        ];
      })
      .addCase(getTimeOffDaysConfig.fulfilled, (state, action) => {
        const { priority, ...rest } = action.payload;

        state.TOTSettings.config = rest;
        state.TOTSettings.priority = priority;
      })
      .addCase(getTimeOffDaysConfig.rejected, (state, action) => {
        state.errorNotifications = [
          ...state.errorNotifications,
          `Error while fetching TOTs config: ${action.error.message}`,
        ];
      })
      .addCase(getTOTSettings.fulfilled, (state, action) => {
        state.TOTSettings.working = action.payload;
      })
      .addCase(getTOTSettings.rejected, (state, action) => {
        state.errorNotifications = [
          ...state.errorNotifications,
          `Error while fetching TOTs settings: ${action.error.message}`,
        ];
      })
      .addCase(getTOTs.fulfilled, (state, action) => {
        state.TOTs = action.payload;
      })
      .addCase(getTOTs.rejected, (state, action) => {
        state.errorNotifications = [...state.errorNotifications, `Error while fetching TOTs: ${action.error.message}`];
      });
  },
});

export const {
  setSelectedPlanCycle,
  setWorkingHours,
  setHolidayHours,
  setTimeOffHours,
  setWorkingDays,
  setWorkedDays,
  setDaysToClose,
  setLoading,
  addErrorNotification,
  setWeekendsCount,
} = applicationSlice.actions;

export const getPlanCycle = createAsyncThunk('application/getPlanCycle', async () => {
  try {
    const [result] = await fetchPlanCycle();

    if (result.length === 0) throw new Error('No Plan Cycle for the current territory.');

    return result
      .map((el) => ({
        id: el.Id,
        startDate: parseDateTimeWithTimeZone(el[`${NAMESPACE}StartDate__c`]).toISO(),
        endDate: parseDateTimeWithTimeZone(el[`${NAMESPACE}EndDate__c`]).toISO(),
        territory: el[`${NAMESPACE}Territory__c`],
        type: el[`${NAMESPACE}Type__c`],
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  } catch (err) {
    throw err;
  }
});

export const getWorkingDaysConfig = createAsyncThunk('application/getWorkingDaysConfig', async () => {
  try {
    const [result] = await fetchWorkingDaysConfig();

    const workingDaysFields = [];

    result.forEach((el) => {
      workingDaysFields.push(el[`${NAMESPACE}Start2__c`]);
      workingDaysFields.push(el[`${NAMESPACE}End2__c`]);
    });

    return workingDaysFields;
  } catch (err) {
    throw err;
  }
});

export const getBusinessHoursConfig = createAsyncThunk('application/getBusinessHoursConfig', async () => {
  try {
    const [[result]] = await fetchBusinessHoursConfig();

    return result[`${NAMESPACE}BusinessHours__c`];
  } catch (err) {
    throw err;
  }
});

export const getTimeOffDaysConfig = createAsyncThunk('application/getTimeoffDaysConfig', async () => {
  try {
    const [[result]] = await fetchTimeOffDaysConfig();

    return {
      start: `${NAMESPACE}${result[`${NAMESPACE}Start2__c`]}`,
      end: `${NAMESPACE}${result[`${NAMESPACE}End2__c`]}`,
      method: `${NAMESPACE}${result[`${NAMESPACE}Method2__c`]}`,
      type: `${NAMESPACE}${result[`${NAMESPACE}Type2__c`]}`,
      value: `${NAMESPACE}${result[`${NAMESPACE}Value2__c`]}`,
      priority: result[`${NAMESPACE}Priority2__c`],
    };
  } catch (err) {
    throw err;
  }
});

export const getBusinessHours = createAsyncThunk('application/getBusinessHours', async (_, store) => {
  try {
    const { application: state } = store.getState();

    const [[result]] = await fetchBusinessHours(state.businessHoursConfig, state.workingDaysConfig);

    if (!result || !Object.keys(result).length) throw new Error('Global Business Hours was not setup.');

    return result;
  } catch (err) {
    throw err;
  }
});

export const getHolidays = createAsyncThunk('application/getHolidayHours', async (_, store) => {
  try {
    const { application: state } = store.getState();

    const [[config]] = await fetchHolidayDaysConfig();

    const [holidays] = await fetchHolidays(
      config[`${NAMESPACE}Start2__c`],
      state.businessHoursConfig,
      DateTime.fromISO(state.selectedPlanCycle.startDate).toFormat('yyyy-MM-dd'),
      DateTime.fromISO(state.selectedPlanCycle.endDate).toFormat('yyyy-MM-dd')
    );

    return {
      count: holidays.length,
      holidays: holidays,
      priority: config[`${NAMESPACE}Priority2__c`],
    };
  } catch (err) {
    throw err;
  }
});

export const getHoursInWorkDay = createAsyncThunk('application/getHoursInWorkDay', async () => {
  try {
    const [[result]] = await fetchHoursInWorkDay();
    const hoursInWorkDay = result[`${NAMESPACE}HoursInWorkDay__c`];

    if (!hoursInWorkDay || hoursInWorkDay <= 0) {
      throw new Error('Hours In Work Day was not setup.');
    }

    return hoursInWorkDay;
  } catch (err) {
    throw err;
  }
});

export const getTOTSettings = createAsyncThunk('application/getTOTSettings', async () => {
  try {
    const [[result]] = await fetchTOTSettings();

    if (result[`${NAMESPACE}Working__c`] && result[`${NAMESPACE}Working__c`].length) {
      return result[`${NAMESPACE}Working__c`].split(';');
    } else {
      return [];
    }
  } catch (err) {
    throw err;
  }
});

export const getTOTs = createAsyncThunk('application/getTOTs', async (_, store) => {
  try {
    const { application: state } = store.getState();

    const [result] = await fetchTOTs(
      Object.values(state.TOTSettings.config),
      state.TOTSettings.working,
      {
        fieldName: state.TOTSettings.config.start,
        value: state.selectedPlanCycle.startDate,
      },
      {
        fieldName: state.TOTSettings.config.end,
        value: state.selectedPlanCycle.endDate,
      }
    );

    return result.map((tot) => ({
      ...tot,
      [state.TOTSettings.config.start]: parseDateTimeWithTimeZone(tot[state.TOTSettings.config.start]).toISO(),
      [state.TOTSettings.config.end]: parseDateTimeWithTimeZone(tot[state.TOTSettings.config.end]).toISO(),
    }));
  } catch (err) {
    throw err;
  }
});

export const getInitialData = createAsyncThunk('application/getInitialData', async (_, store) => {
  try {
    const { application: state } = store.getState();

    if (state.planCycles.length === 0) {
      await store.dispatch(getPlanCycle());

      await Promise.all([
        store.dispatch(getHoursInWorkDay()),
        store.dispatch(getBusinessHoursConfig()),
        store.dispatch(getWorkingDaysConfig()),
        store.dispatch(getTimeOffDaysConfig()),
        store.dispatch(getTOTSettings()),
      ]);

      await store.dispatch(getBusinessHours());
    }

    const { planCycles, hoursInWorkDay, businessHours } = store.getState().application;

    if (planCycles.length > 0 && hoursInWorkDay && Object.keys(businessHours).length > 0) {
      await Promise.all([store.dispatch(getHolidays()), store.dispatch(getTOTs())]);
    }
  } catch (err) {
    throw err;
  }
});

export const getData = createAsyncThunk('application/getData', async (_, store) => {
  try {
    store.dispatch(setLoading(true));

    await store.dispatch(getInitialData());

    const { application: state } = store.getState();

    if (state.error || !state.hoursInWorkDay) return;

    const workingHoursByEachDay = calculateWorkingHoursByEachDay(state.businessHours);
    const weekdays = calculateWeekDays(state.selectedPlanCycle.startDate, state.selectedPlanCycle.endDate);
    const weekendsCount = Object.keys(weekdays).reduce(
      (acc, day) => acc + (workingHoursByEachDay[day] === 0 ? weekdays[day] : 0),
      0
    );

    const workingHours = calculateWorkingHours(workingHoursByEachDay, weekdays);

    if (workingHours === 0) return store.dispatch(addErrorNotification('Wrong Business Hours config.'));

    const holidayHours = state.hoursInWorkDay * state.holidaysCount;

    const timeOffHours = calculateTimeOffHours(
      state.TOTs,
      state.TOTSettings.config,
      state.hoursInWorkDay,
      state.selectedPlanCycle.startDate,
      state.selectedPlanCycle.endDate
    );

    const overlapBetweenTOTsAndHolidays = calculateOverlapHours(
      state.TOTs,
      state.holidays,
      state.businessHours,
      state.TOTSettings.config
    );

    if (overlapBetweenTOTsAndHolidays) {
      adjustHoursWithOverlap(
        overlapBetweenTOTsAndHolidays,
        state.holidaysConfig.priority,
        state.TOTSettings.priority,
        timeOffHours,
        holidayHours
      );
    }

    store.dispatch(setWorkingHours(workingHours));
    store.dispatch(setHolidayHours(holidayHours));
    store.dispatch(setTimeOffHours(timeOffHours));

    const totalWorkingDays = calculateTotalWorkingDays(workingHours, holidayHours, timeOffHours, state.hoursInWorkDay);

    store.dispatch(setWorkingDays(totalWorkingDays));

    const weekDaysByToday = calculateWeekDays(
      state.selectedPlanCycle.startDate,
      dateTimeLocal.startOf('day').minus({ days: 1 }).toISO()
    );

    let workedHoursByToday = calculateWorkingHours(workingHoursByEachDay, weekDaysByToday);

    const isPlanCycleExpired =
      dateTimeLocal.startOf('day') > DateTime.fromISO(state.selectedPlanCycle.endDate).startOf('day');

    const filterItemsByToday = (items, dateField) => {
      const today = dateTimeLocal.startOf('day');

      return items.filter((item) => {
        const itemDate = resetTimeZone(item[dateField]).startOf('day');

        return itemDate <= today;
      });
    };

    const TOTsByToday = filterItemsByToday(state.TOTs, state.TOTSettings.config.end);
    const holidaysHoursByToday =
      filterItemsByToday(state.holidays, `${NAMESPACE}Date__c`).length * state.hoursInWorkDay;

    const timeOffHoursByToday = calculateTimeOffHours(
      TOTsByToday,
      state.TOTSettings.config,
      state.hoursInWorkDay,
      state.selectedPlanCycle.startDate,
      state.selectedPlanCycle.endDate
    );

    const overlapBetweenTOTsAndHolidaysByToday = calculateOverlapHours(
      TOTsByToday,
      state.holidays,
      state.businessHours,
      state.TOTSettings.config
    );

    if (overlapBetweenTOTsAndHolidaysByToday) {
      adjustHoursWithOverlap(
        overlapBetweenTOTsAndHolidaysByToday,
        state.holidaysConfig.priority,
        state.TOTSettings.priority,
        timeOffHoursByToday,
        holidaysHoursByToday
      );
    }

    const workedDays = isPlanCycleExpired
      ? totalWorkingDays
      : (workedHoursByToday - timeOffHoursByToday - holidaysHoursByToday) / state.hoursInWorkDay;
    const daysToClose = isPlanCycleExpired ? 0 : totalWorkingDays - workedDays;

    store.dispatch(setWeekendsCount(weekendsCount));
    store.dispatch(setWorkedDays(workedDays));
    store.dispatch(setDaysToClose(daysToClose));

    store.dispatch(setLoading(false));
  } catch (err) {
    console.log(err);
    throw err;
  }
});

export default applicationSlice.reducer;
