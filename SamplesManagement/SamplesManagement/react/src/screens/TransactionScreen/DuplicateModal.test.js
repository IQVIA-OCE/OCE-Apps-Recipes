import React from 'react';
import DuplicateModal from './DuplicateModal';
import { Provider, Button, TextInput } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import {Formik} from "formik";

describe('DuplicateModal', () => {
  it('should render component', () => {
    const { UNSAFE_root } = render(
      <Provider>
        <DuplicateModal
          handleAction={jest.fn()}
          status={'Open'}
          onDismiss={jest.fn()}
        />
      </Provider>
    );
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(Formik)).toBeTruthy();
  });

  it('should submit form', () => {
    const action = jest.fn();
    const onDismiss = jest.fn();
    const { UNSAFE_root } = render(
      <Provider>
        <DuplicateModal
          handleAction={action}
          status={'Open'}
          onDismiss={onDismiss}
        />
      </Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.changeText(UNSAFE_root.findAllByType(TextInput)[0], 'test');
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    act(() => jest.runAllTimers());

    expect(action).toHaveBeenCalled();

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    act(() => jest.runAllTimers());

    expect(onDismiss).toHaveBeenCalled();
  });
});
