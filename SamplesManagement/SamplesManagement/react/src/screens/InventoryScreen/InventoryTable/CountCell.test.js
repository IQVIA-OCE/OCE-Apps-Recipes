import React from 'react';
import CountCell from './CountCell';
import { Formik } from 'formik';
import { TextInput } from 'apollo-react-native';
import { render, act } from '@testing-library/react-native';

const Component = () => (
  <Formik
    initialValues={{ id: '123', status: 'Saved', products: [{ id: '1', physicalQuantity: 2 }] }}
  >
    <CountCell row={{ id: '1' }} />
  </Formik>
);

describe('CountCell', () => {
  it('should render properly', async () => {
    const { container, getByTestId, rerender } = render(<Component />);

    act(() => {
      container.findByType(TextInput).props.onChangeText('1');
    });

    expect(getByTestId('CountCell')).toBeTruthy();

    rerender(<Component />)

    expect(getByTestId('CountCell')).toBeTruthy();
  });
});
