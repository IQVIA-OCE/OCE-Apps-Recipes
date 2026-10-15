export const loadingStatusSelector = (state) =>
  state.reconciliationReport.loadingStatus;

export const limitErrorRecordsSelector = (state) =>
  state.reconciliationReport.limitErrorRecords;

export const templatesSelector = (state) =>
  state.reconciliationReport.templates;

export const searchAccountQuerySelector = (state) =>
  state.reconciliationReport.params.searchQuery;

export const templateFilterSelector = (state) =>
  state.reconciliationReport.params.templateFilter;

export const sortFieldSelector = (state) =>
  state.reconciliationReport.params.sortField;

export const sortOrderSelector = (state) =>
  state.reconciliationReport.params.sortOrder;

export const accountRecordsSelector = (state) =>
  state.reconciliationReport.accountRecords;

export const callActivitySelector = (state) =>
  state.reconciliationReport.callActivityRecords;
