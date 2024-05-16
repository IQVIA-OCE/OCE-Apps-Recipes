import React from 'react';
import PanelHeader from './PanelHeader';
import { Formik } from 'formik';
import { render } from '@testing-library/react-native';

jest.mock('moment', () => () => ({ format: () => 'May 3, 2020 06:19 pm' }));

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
    )

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
    )

    expect(queryByText(/transactionRepName/)).toBeNull();
  });
});
