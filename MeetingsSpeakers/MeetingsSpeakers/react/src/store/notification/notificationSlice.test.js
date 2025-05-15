import { bootstrap, fetchSpeakers, fetchMoreSpeakers, saveInvitedSpeakers } from '../speakerPicker/speakerPickerSlice';

import { initialState, closeNotification, showErrorNotification, notificationSliceReducer } from './notificationSlice';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
    profileId: () => '',
    userID: () => '',
  },
  localized: (_, fallback) => fallback,
}));

const ERROR_STATE = {
  variant: 'error',
  text: '',
  icon: 'alert-circle',
  isVisible: true,
};

const SUCCESS_STATE = {
  variant: 'success',
  text: '',
  icon: 'checkbox-marked-circle',
  isVisible: true,
};

const WARNING_STATE = {
  variant: 'warning',
  text: '',
  icon: 'alert',
  isVisible: true,
};

const NOTHING_TO_SAVE_STATE = {
  variant: '',
  text: '',
  icon: '',
  isVisible: false,
};

describe('notificationSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  it('showErrorNotification reducer', () => {
    const nextState = notificationSliceReducer(state, showErrorNotification('test text'));

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'test text' });
  });

  it('closeNotification reducer', () => {
    const nextState = notificationSliceReducer(state, closeNotification());

    expect(nextState.isVisible).toBeFalsy();
  });

  it('fetchSpeakers.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      fetchSpeakers.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('fetchMoreSpeakers.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      fetchMoreSpeakers.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('bootstrap.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      bootstrap.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('saveInvitedSpeakers.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      saveInvitedSpeakers.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('saveInvitedSpeakers.fulfilled extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      saveInvitedSpeakers.fulfilled({ wasSomeDataSaved: true }, '', () => {}, {})
    );

    expect(nextState).toStrictEqual({
      ...SUCCESS_STATE,
      text: 'All changes have been saved',
    });
  });

  it('saveInvitedSpeakers.fulfilled extraReducer with warning', () => {
    const nextState = notificationSliceReducer(
      state,
      saveInvitedSpeakers.fulfilled({ wasSomeDataSaved: true, warning: 'Warning' }, '', () => {}, {})
    );

    expect(nextState).toStrictEqual({
      ...WARNING_STATE,
      text: 'Warning',
    });
  });

  it('saveInvitedSpeakers.fulfilled extraReducer without wasSomeDataSaved ', () => {
    const nextState = notificationSliceReducer(
      state,
      saveInvitedSpeakers.fulfilled({ wasSomeDataSaved: false }, '', () => {}, {})
    );
    expect(nextState).toStrictEqual({ ...NOTHING_TO_SAVE_STATE });
  });
});
