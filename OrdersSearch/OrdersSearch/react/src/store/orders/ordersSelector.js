export const ordersListSelector = state => state.orders.ordersList.list;
export const ordersListLoadingSelector = state => state.orders.ordersList.loadingStatus;
export const recordIdSelector = state => state.orders._recordId;
export const accountIdSelector = state => state.orders.account.id;
export const accountNameSelector = state => state.orders.account.name;
export const accountNameLoadingSelector = state => state.orders.account.loadingStatus;
export const pageTypeSelector = state => state.orders.pageType;
export const errorSelector = state => state.orders.error;