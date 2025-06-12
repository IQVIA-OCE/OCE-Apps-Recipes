import { closeNotification, initialState, notificationReducer, showErrorNotification } from './notificationSlice';
import { bootstrap, deleteToDo, fetchCallToDos, saveToDo } from '../callToDos/callToDosSlice';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
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
    const nextState = notificationReducer(initialState, closeNotification());

    expect(nextState.isVisible).toEqual(false);
  });

  it('showErrorNotification reducer', () => {
    const nextState = notificationReducer(initialState, showErrorNotification(new Error('Something went wrong')));

    expect(nextState.isVisible).toEqual(true);
    expect(nextState.variant).toEqual('error');
    expect(nextState.icon).toEqual('alert-circle');
    expect(nextState.text).toEqual('Something went wrong');
  });

  it('bootstrap.rejected extraReducer', () => {
    const nextState = notificationReducer(
      initialState,
      bootstrap.rejected(null, '', () => {}, { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });

  it('fetchCallToDos.rejected extraReducer', () => {
    const nextState = notificationReducer(
      initialState,
      fetchCallToDos.rejected(
        null,
        '',
        () => {},
        { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] },
        {}
      )
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });

  it('saveToDo.rejected extraReducer', () => {
    const nextState = notificationReducer(
      initialState,
      saveToDo.rejected(null, '', () => {}, { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });

  describe('saveToDo.fulfilled extraReducer', () => {
    it('create', () => {
      const nextState = notificationReducer(initialState, saveToDo.fulfilled({ isEdit: false }));

      expect(nextState).toStrictEqual({ ...SUCCESS_STATE, text: 'Successfully created a Call To-Do' });
    });

    it('edit', () => {
      const nextState = notificationReducer(initialState, saveToDo.fulfilled({ isEdit: true }));

      expect(nextState).toStrictEqual({ ...SUCCESS_STATE, text: 'Successfully edited a Call To-Do' });
    });
  });

  it('deleteToDo.rejected extraReducer', () => {
    const nextState = notificationReducer(
      initialState,
      deleteToDo.rejected(null, '', () => {}, { error: [{ errorCode: 'INVALID_REQUEST', message: 'Test error' }] }, {})
    );

    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'INVALID_REQUEST: Test error' });
  });
});
