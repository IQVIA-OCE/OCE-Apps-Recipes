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

  test('saveBudget.fulfilled extraReducer when message is success', () => {
    const nextState = notificationSliceReducer(
      state,
      saveBudget.fulfilled(
        { wasBudgetSaved: true, success: 'Success message', warning: null },
        '',
        () => {},
        {}
      )
    );

    expect(nextState).toStrictEqual({
      ...SUCCESS_STATE,
      text: 'Success message',
    });
  });

  test('saveBudget.fulfilled extraReducer when message is warning', () => {
    const nextState = notificationSliceReducer(
      state,
      saveBudget.fulfilled(
        { wasBudgetSaved: true, success: null, warning: 'Warning message' },
        '',
        () => {},
        {}
      )
    );

    expect(nextState).toStrictEqual({
      ...WARNING_STATE,
      text: 'Warning message',
    });
  });

  test('saveBudget.fulfilled extraReducer when budget was not saved', () => {
    const nextState = notificationSliceReducer(
      state,
      saveBudget.fulfilled(
        { wasBudgetSaved: false, success: null, warning: null },
        '',
        () => {},
        {}
      )
    );

    expect(nextState).toStrictEqual(initialState);
  });
});
