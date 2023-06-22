export const formLoadingStatusSelector = (state) => state.callToDos.formLoadingStatus;
export const callSelector = (state) => state.callToDos.call;
export const complianceTypesSelector = (state) => state.callToDos.complianceTypes;

export const todosListLoadingStatusSelector = (state) => state.callToDos.list.loadingStatus;
export const todosListParamsSelector = (state) => state.callToDos.list.params;
export const todosListTotalCountSelector = (state) => state.callToDos.list.totalCount;
export const todosListItemsSelector = (state) => state.callToDos.list.items;
