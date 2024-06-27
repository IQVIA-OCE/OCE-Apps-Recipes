export const isLoadingSelector = state => state.application.isLoading;
export const planCycleSelector = state => state.application.selectedPlanCycle;
export const planCyclesSelector = state => state.application.planCycles;
export const workingDaysSelector = state => state.application.workingDays;
export const totDaysSelector = state => state.application.totDays;
export const workedDaysSelector = state => state.application.workedDays;
export const daysToCloseSelector = state => state.application.daysToClose;
export const errorSelector = state => state.application.error;
export const errorNotificationsSelector = state => state.application.errorNotifications;
export const holidayHoursSelector = state => state.application.holidayHours;
export const hoursInWorkDaySelector = state => state.application.hoursInWorkDay;
export const weekendsSelector = state => state.application.weekendsCount;