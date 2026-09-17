export const budgetsSelector = state => state.budgetPicker.budgets;

export const meetingSelector = state => state.budgetPicker.meeting;

export const errorSelector = state => state.budgetPicker.error;

export const loadingStatusSelector = state => state.budgetPicker.loadingStatus;

export const searchQuerySelector = state => state.budgetPicker.params.searchQuery;

export const systemGeneratedFilterSelector = state => state.budgetPicker.isSystemGeneratedFilterEnabled;
