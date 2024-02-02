import { closeNotification, initialState, notificationReducer, showErrorNotification } from "./NotificationSlice";
import { bootstrap, fetchReportData } from "../ReconciliationReport/ReconciliationReportSlice";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    sfApiVersion: () => '',
    userID: () => '',
    locale: () => '',
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));
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

  it('showErrorNotification reducer', () => {
    const nextState = notificationReducer( state, showErrorNotification('test text'));
    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'test text' });
  });

  it('closeNotification reducer', () => {
    const nextState = notificationReducer(state, closeNotification);
    expect(nextState.isVisible).toBeFalsy();
  });

  it('fetchReportData.rejected extraReducer', () => {
    const nextState = notificationReducer( state, fetchReportData.rejected(null, '', () => {}, { message: 'Error text' }, {}));
    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });

  it('bootstrap.rejected extraReducer', () => {
    const nextState = notificationReducer( state, bootstrap.rejected(null, '', () => {}, { message: 'Error text' }, {}));
    expect(nextState).toStrictEqual({ ...ERROR_STATE, text: 'Error text' });
  });
});
