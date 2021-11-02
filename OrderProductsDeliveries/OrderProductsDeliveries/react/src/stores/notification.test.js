import reducer, {
    showErrorNotification,
    closeNotification
} from './notification';

const initialState = {
    variant: '',
    text: '',
    icon: '',
    visible: false
};

test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('should handle error state', () => {
    const previousState = initialState;
    expect(reducer(previousState, showErrorNotification('error'))).toEqual({
        variant: 'error',
        icon: 'alert-circle',
        text:  'error',
        visible: true
    });
});

test('should handle close state', () => {
    const previousState = initialState;
    expect(reducer(previousState, closeNotification({
        visible: false
    }))).toEqual({
        variant: '',
        text: '',
        icon: '',
        visible: false
    });
});