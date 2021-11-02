import {
  bootstrap,
  fetchTopics,
  fetchMoreTopics,
  saveSelectedTopics,
} from '../topicPicker/topicPickerSlice'

import {
  initialState,
  closeNotification,
  showErrorNotification,
  notificationReducer
} from './notificationSlice'

jest.mock('../../../bridge/Location/LocationManager', () => ({
  localized: (_, fallback) => fallback,
}));
jest.mock('../../../bridge/EnvironmentData/EnvironmentData', () => ({
  environment: {
    namespace: () => 'OCE__',
    userID: () => '1',
    sfApiVersion: () => '1',
    locale: () => 'en_US',
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
  text: '',
  icon: 'checkbox-marked-circle',
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
    const nextState = notificationReducer(
      state,
      showErrorNotification('test text')
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'test text' });
  });

  it('showErrorNotification reducer', () => {
    const nextState = notificationReducer(
      state,
      showErrorNotification('test text')
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'test text' });
  });

  it('closeNotification reducer', () => {
    const nextState = notificationReducer(state, closeNotification());

    expect(nextState.isVisible).toBeFalsy();
  });

  it('fetchTopics.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      fetchTopics.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('fetchMoreTopics.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      fetchMoreTopics.rejected(
        null,
        '',
        () => {},
        { message: 'Error text' },
        {}
      )
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('bootstrap.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      bootstrap.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('saveSelectedTopics.rejected extraReducer', () => {
    const nextState = notificationReducer(
      state,
      saveSelectedTopics.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('saveSelectedTopics.fulfilled extraReducer', () => {
    const nextState = notificationReducer(
      state,
      saveSelectedTopics.fulfilled({ wasSomeDataSaved: true }, '', () => {}, {})
    );

    expect(nextState).toStrictEqual({
      ...SUCCESS_STATE,
      text: 'All changes have been saved',
    });
  });

  it('saveSelectedTopics.fulfilled extraReducer without wasSomeDataSaved ', () => {
    const nextState = notificationReducer(
      state,
      saveSelectedTopics.fulfilled({ wasSomeDataSaved: false }, '', () => {}, {})
    );
    expect(nextState).toStrictEqual({ ...NOTHING_TO_SAVE_STATE });
  });
});
