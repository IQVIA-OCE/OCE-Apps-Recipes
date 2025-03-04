export const callObjSelector = (state) => state.callStore.callObj;
export const callAttendeesSelector = (state) => state.callStore.callAttendees;
export const ordersSelector = (state) => state.callStore.orders.data;
export const inquiriesSelector = (state) => state.callStore.inquiries.data;
export const storeCheckSelector = (state) => state.callStore.storeCheck.data;
export const ordersTotalSizeSelector = (state) =>
  state.callStore.orders.totalSize;
export const inquiriesTotalSizeSelector = (state) =>
  state.callStore.inquiries.totalSize;
export const storeCheckTotalSizeSelector = (state) =>
  state.callStore.storeCheck.totalSize;
export const inquiryTypesSelector = (state) =>
  state.callStore.inquiryFormData.inquiryTypes;
export const inquiryChannelsSelector = (state) =>
  state.callStore.inquiryFormData.inquiryChannels;
export const permissionsSelector = (state) => state.callStore.permissions;
export const loadingStatusSelector = (state) => state.callStore.loadingStatus;
