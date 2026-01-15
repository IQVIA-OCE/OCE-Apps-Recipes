import React from 'react';
import CountCell from './CountCell';
import { Formik } from 'formik';
import { TextInput } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';

const Component = () => (
  <Formik
    initialValues={{ id: '123', status: 'Saved', products: [{ id: '1', physicalQuantity: '2' }] }}
  >
    <CountCell row={{ id: '1' }} />
  </Formik>
);

describe('CountCell', () => {
  it('should render properly', async () => {
    const { UNSAFE_root, getByTestId, rerender } = render(<Component />);

    fireEvent.changeText(UNSAFE_root.findByType(TextInput), '1');

    expect(getByTestId('CountCell')).toBeTruthy();

    rerender(<Component />);
    act(() => jest.runAllTimers());

    expect(getByTestId('CountCell')).toBeTruthy();
  });
});
