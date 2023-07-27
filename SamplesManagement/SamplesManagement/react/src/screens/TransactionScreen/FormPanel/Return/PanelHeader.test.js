import React from 'react';
import PanelHeader from './PanelHeader';
import moment from 'moment';
import { Formik } from 'formik';
import { render } from '@testing-library/react-native';

jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm'}));

describe('PanelHeader', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <Formik initialValues={{ fields: { status: 'In Progress', transactionRep: { Name: 'transactionRepName' } } }}>
        <PanelHeader />
      </Formik>
    );

    expect(getByText(/In Progress/)).toBeTruthy();
    expect(getByText(/transactionRepName/)).toBeTruthy();
  });
});
