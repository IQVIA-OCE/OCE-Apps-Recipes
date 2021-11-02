import {
  bootstrap,
  fetchBudgets,
  fetchMoreBudgets,
  saveBudget,
} from '../budgetPicker/budgetPickerSlice';
import {
  closeNotification,
  initialState,
  notificationSliceReducer,
  showErrorNotification,
} from './notificationSlice';

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

describe('notificationSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  test('showErrorNotification reducer', () => {
    const nextState = notificationSliceReducer(
      state,
      showErrorNotification('Test text')
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Test text' });
  });

  test('closeNotification reducer', () => {
    const nextState = notificationSliceReducer(state, closeNotification());

    expect(nextState.isVisible).toBeFalsy();
  });

  test('fetchBudgets.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      fetchBudgets.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  test('fetchMoreBudgets.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      fetchMoreBudgets.rejected(
        null,
        '',
        () => {},
        { message: 'Error text' },
        {}
      )
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  test('bootstrap.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      bootstrap.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  test('saveBudget.rejected extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      saveBudget.rejected(null, '', () => {}, { message: 'Error text' }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  test('saveBudget.fulfilled extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      saveBudget.fulfilled({ wasBudgetSaved: true }, '', () => {}, {})
    );

    expect(nextState).toStrictEqual({
      ...SUCCESS_STATE,
      text: 'All changes have been saved',
    });
  });
});
