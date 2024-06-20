import {
  callBootstrap,
  createNewInquiry,
  fetchInquiries,
  fetchOrders,
  fetchStoreCheck,
  setCallPermissions,
} from '../call/callSlice';
import {
  fetchCalls,
  fetchMeetingAttendees,
  meetingBootstrap,
} from '../meeting/meetingSlice';
import { identifyPage } from '../settings/settingsSlice';
import {
  closeNotification,
  initialState,
  notificationReducer,
  showErrorNotification,
  showWarningNotification,
} from './notificationSlice';

const ERROR = {
  variant: 'error',
  icon: 'alert-circle',
  text: '',
  isVisible: true,
};

const WARNING = {
  variant: 'warning',
  icon: 'alert',
  text: '',
  isVisible: true,
};

const SUCCESS = {
  variant: 'success',
  icon: 'checkbox-marked-circle',
  text: '',
  isVisible: true,
};

describe('notificationSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  test('showErrorNotification reducer', () => {
    const nextState = notificationReducer(
      state,
      showErrorNotification('Test text')
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Test text' },
    ]);
  });

  test('showWarningNotification reducer', () => {
    const nextState = notificationReducer(
      state,
      showWarningNotification('Test text')
    );

    expect(nextState.notifications).toStrictEqual([
      { ...WARNING, text: 'Test text' },
    ]);
  });

  test('closeNotification reducer', () => {
    const nextState = notificationReducer(
      {
        notifications: [ERROR, WARNING, SUCCESS],
      },
      closeNotification(1)
    );

    expect(nextState.notifications.length).toEqual(2);
    expect(nextState.notifications).toStrictEqual([ERROR, SUCCESS]);
  });

  test('identifyPage.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      identifyPage.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('callBootstrap.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      callBootstrap.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('fetchOrders.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      fetchOrders.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('fetchInquiries.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      fetchInquiries.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('fetchStoreCheck.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      fetchStoreCheck.rejected(
        null,
        '',
        () => {},
        { message: 'Error text' },
        {}
      )
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('setCallPermissions.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      setCallPermissions.rejected(
        null,
        '',
        () => {},
        { message: 'Error text' },
        {}
      )
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('meetingBootstrap.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      meetingBootstrap.rejected(
        null,
        '',
        () => {},
        { message: 'Error text' },
        {}
      )
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('fetchCalls.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      fetchCalls.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('fetchMeetingAttendees.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      fetchMeetingAttendees.rejected(
        null,
        '',
        () => {},
        { message: 'Error text' },
        {}
      )
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('createNewInquiry.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      createNewInquiry.rejected(
        null,
        '',
        () => {},
        { message: 'Error text' },
        {}
      )
    );

    expect(nextState.notifications).toStrictEqual([
      { ...ERROR, text: 'Error text' },
    ]);
  });

  test('createNewInquiry.fulfilled extraReducer', () => {
    const nextState = notificationReducer(
      state,
      createNewInquiry.fulfilled(undefined, '', () => {}, {})
    );

    expect(nextState.notifications).toStrictEqual([
      {
        ...SUCCESS,
        text: 'New Inquiry has been created!',
      },
    ]);
  });
});
