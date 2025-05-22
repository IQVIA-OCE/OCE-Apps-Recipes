import React from 'react';
import StorageLocation from './StorageLocation';
import { AppContext } from '../../AppContext';
import { useBanner } from '../../hooks';
import { Checkbox, Select, TextInput, Button, Loader } from '@oce-apps/apollo-react-native';
import { Formik } from 'formik';
import { render, act, fireEvent } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('../../hooks/useBanner');
jest.mock('@react-navigation/native');

const context = {
  username: 'test user name',
  userId: '1',
};

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

const setBanner = jest.fn();
useBanner.mockReturnValue([
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
]);

describe('StorageLocation', () => {
  beforeEach(() => {
    setBanner.mockClear();
    useNavigation.mockImplementation(() => ({
      getParam: () => {
      },
      goBack: () => {
      },
      setParams: () => {
      },
      navigate: jest.fn(),
    }));
    useRoute.mockReturnValue({
      params: {
        id: 'id'
      }
    });

  });

  it('Should render Create form', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(Formik)).toBeTruthy();
    act(() => jest.runAllTimers());
  });

  it('Should trigger form value change', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    const [TextInput1, TextInput2, TextInput3, TextInput4] =
      UNSAFE_root.findAllByType(TextInput);
    const [Select1, Select2] = UNSAFE_root.findAllByType(Select)

    fireEvent.changeText(TextInput1, 'address 1');
    fireEvent.changeText(TextInput2, 'address 2');
    fireEvent.changeText(TextInput3, 'city');
    fireEvent.changeText(TextInput4, 'zip');
    fireEvent(Select1, 'zip', 'change', '');
    fireEvent(Select2, 'zip', 'change', '');
    fireEvent.press(UNSAFE_root.findByType(Checkbox));
    act(() => jest.runAllTimers());

    expect(TextInput1.props.value).toBe('address 1');
    expect(TextInput2.props.value).toBe('address 2');
    expect(TextInput3.props.value).toBe('city');
    expect(TextInput4.props.value).toBe('zip');
  });

  it('Should trigger button clicks', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(Formik)).toBeTruthy();
  });

  it('Should trigger submit', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    fireEvent(
      UNSAFE_root.findByType(Formik),
      'onSubmit',
      { address1: '' },
      {
        resetForm: () => {},
        setValues: () => {},
      }
    );
    act(() => jest.runAllTimers());

    expect(setBanner).toHaveBeenCalledTimes(1);
  });

  it('Should render Edit form', () => {
    useRoute.mockReturnValue({
      params: {
        locationId: 'id'
      }
    });
    const { getByText } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    expect(getByText(/Edit/)).toBeTruthy();
    act(() => jest.runAllTimers());
  });

  it('Should show loader', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findAllByType(Loader)).toBeTruthy();
    act(() => jest.runAllTimers());
  });

  it('Should trigger submit and redirect', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <StorageLocation />
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    fireEvent(
      UNSAFE_root.findByType(Formik),
      'onSubmit',
      { address1: '' },
      {
        resetForm: () => {
        }, setValues: () => {
        },
      },
    );
    act(() => jest.runAllTimers());

    expect(setBanner).toHaveBeenCalledTimes(1);
  });
});
