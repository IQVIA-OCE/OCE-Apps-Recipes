import React from 'react';
import PanelHeader from './PanelHeader';
import { Formik } from 'formik';
import { act, render } from '@testing-library/react-native';

describe('PanelHeader', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <Formik
        initialValues={{
          fields: {
            transactionDateTime: '',
            status: 'InProgress',
            transactionRep: { Name: 'transactionRepName' },
            territory: { name: 'name' },
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/transactionRepName/)).toBeTruthy();
    expect(getByText(/InProgress/)).toBeTruthy();
  });

  it('should render properly without transactionRep', () => {
    const { queryByText } = render(
      <Formik
        initialValues={{
          fields: {
            transactionDateTime: '',
            status: 'InProgress',
            territory: { name: 'name' },
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(queryByText(/transactionRepName/)).toBeNull();
  });
});
