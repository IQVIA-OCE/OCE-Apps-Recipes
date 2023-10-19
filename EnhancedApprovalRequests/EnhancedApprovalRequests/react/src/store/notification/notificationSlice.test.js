import { closeNotification, initialState, notificationSliceReducer } from './notificationSlice';
import {
  approveRequests,
  bootstrap,
  fetchApprovalRequests,
  reassignRequests,
  rejectRequests,
} from '../approvalRequests/approvalRequestsSlice';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '',
  },
}));

const ERROR_STATE = {
  variant: 'error',
  text: '',
  icon: 'alert-circle',
  isVisible: true,
};

const SUCCESS_STATE = {
  variant: 'success',
  icon: 'checkbox-marked-circle',
  isVisible: true,
};

describe('notificationSlice', () => {
  it('closeNotification reducer', () => {
    const nextState = notificationSliceReducer(initialState, closeNotification());

    expect(nextState.isVisible).toEqual(false);
  });

  it('bootstrap.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      initialState,
      bootstrap.rejected(null, '', () => {}, { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });

  it('fetchApprovalRequests.pending extraReducer', () => {
    const nextState = notificationSliceReducer(ERROR_STATE, fetchApprovalRequests.pending());

    expect(nextState).toStrictEqual({
      ...initialState,
    });
  });

  it('fetchApprovalRequests.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      initialState,
      fetchApprovalRequests.rejected(
        null,
        '',
        () => {},
        { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] },
        {}
      )
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });

  it('approveRequests.pending extraReducer', () => {
    const nextState = notificationSliceReducer(ERROR_STATE, approveRequests.pending());

    expect(nextState).toStrictEqual({
      ...initialState,
    });
  });

  it('approveRequests.fulfilled extraReducer', () => {
    const nextState = notificationSliceReducer(initialState, approveRequests.fulfilled());

    expect(nextState).toStrictEqual({ ...SUCCESS_STATE, text: 'Approved successfully' });
  });

  it('approveRequests.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      initialState,
      approveRequests.rejected(
        null,
        '',
        () => {},
        { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] },
        {}
      )
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });

  it('rejectRequests.pending extraReducer', () => {
    const nextState = notificationSliceReducer(ERROR_STATE, rejectRequests.pending());

    expect(nextState).toStrictEqual({
      ...initialState,
    });
  });
  it('rejectRequests.fulfilled extraReducer', () => {
    const nextState = notificationSliceReducer(initialState, rejectRequests.fulfilled());

    expect(nextState).toStrictEqual({ ...SUCCESS_STATE, text: 'Rejected successfully' });
  });

  it('rejectRequests.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      initialState,
      rejectRequests.rejected(
        null,
        '',
        () => {},
        { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] },
        {}
      )
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });

  it('reassignRequests.pending extraReducer', () => {
    const nextState = notificationSliceReducer(ERROR_STATE, reassignRequests.pending());

    expect(nextState).toStrictEqual({
      ...initialState,
    });
  });

  it('reassignRequests.fulfilled extraReducer', () => {
    const nextState = notificationSliceReducer(initialState, reassignRequests.fulfilled());

    expect(nextState).toStrictEqual({ ...SUCCESS_STATE, text: 'Reassigned successfully' });
  });

  it('reassignRequests.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      initialState,
      reassignRequests.rejected(
        null,
        '',
        () => {},
        { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] },
        {}
      )
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });
});
