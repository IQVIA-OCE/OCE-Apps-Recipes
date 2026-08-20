import { notificationReducer, showErrorNotification, closeNotification } from './notification';

const errorState = {
    variant: 'error',
    text: '',
    icon: 'alert-circle',
    visible: true,
};

describe('notification', () => {
    let state;

    beforeEach(() => {
        state = errorState;
    });

    it('showErrorNotification reducer', () => {
        const nextState = notificationReducer( state, showErrorNotification('test text'));
        expect(nextState).toStrictEqual({ ...errorState, text: 'test text' });
    });

    it('closeNotification reducer', () => {
        const nextState = notificationReducer(state, closeNotification);
        expect(nextState.visible).toBeFalsy();
    });
});
