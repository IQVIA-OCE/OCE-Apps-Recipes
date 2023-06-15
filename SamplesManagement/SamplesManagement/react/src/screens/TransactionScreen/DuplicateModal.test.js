import React from 'react';
import DuplicateModal from './DuplicateModal';
import { Provider, Button } from 'apollo-react-native';
import {render, act, waitFor} from '@testing-library/react-native';
import {Formik} from "formik";

describe('DuplicateModal', () => {
  it('should render component', async () => {
    const { container } = render(
      <Provider>
        <DuplicateModal
          handleAction={jest.fn()}
          status={'Open'}
          onDismiss={jest.fn()}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(container.findByType(Formik)).toBeTruthy();
    })
  });

  it('should submit form', async () => {
    const action = jest.fn();
    const { container } = render(
      <Provider>
        <DuplicateModal
          handleAction={action}
          status={'Open'}
          onDismiss={jest.fn()}
        />
      </Provider>
    );

    await waitFor(() => {
      return container.findAllByType(Button).length > 0;
    })

    act(() => container.findAllByType(Button)[1].props.onPress());
  });
});
