export const meetingObjSelector = (state) => state.meetingStore.meetingObj;
export const callsSelector = (state) => state.meetingStore.calls.data;
export const callsTotalSizeSelector = (state) =>
  state.meetingStore.calls.totalSize;
export const meetingAttendeesSelector = (state) =>
  state.meetingStore.meetingAttendees;
export const loadingStatusSelector = (state) =>
  state.meetingStore.loadingStatus;
