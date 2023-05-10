import { bootstrap } from '../territoryStatus/territoryStatusSlice';
import { closeNotification, initialState, notificationSliceReducer } from './notificationSlice';

const ERROR_STATE = {
  variant: 'error',
  text: '',
  icon: 'alert-circle',
  isVisible: true,
};

describe('notificationSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  test('closeNotification reducer', () => {
    const nextState = notificationSliceReducer(state, closeNotification());

    expect(nextState.isVisible).toEqual(false);
  });

  test('bootstrap.reject extraReducer', () => {
    const nextState = notificationSliceReducer(
      state,
      bootstrap.rejected(
        null,
        '',
        () => {},
        { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] },
        {},
      ),
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });
});
