import React from 'react';
import DuplicateModal from './DuplicateModal';
import { Provider, Button } from '@oce-apps/apollo-react-native';
import {render, act, waitFor} from '@testing-library/react-native';
import {Formik} from "formik";

describe('DuplicateModal', () => {
  it('should render component', async () => {
    const { UNSAFE_root } = render(
      <Provider>
        <DuplicateModal
          handleAction={jest.fn()}
          status={'Open'}
          onDismiss={jest.fn()}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(UNSAFE_root.findByType(Formik)).toBeTruthy();
    })
  });

  it('should submit form', async () => {
    const action = jest.fn();
    const { UNSAFE_root } = render(
      <Provider>
        <DuplicateModal
          handleAction={action}
          status={'Open'}
          onDismiss={jest.fn()}
        />
      </Provider>
    );

    await waitFor(() => {
      return UNSAFE_root.findAllByType(Button).length > 0;
    })

    act(() => UNSAFE_root.findAllByType(Button)[1].props.onPress());
  });
});
