import React from 'react';
import PanelHeader from './PanelHeader';
import { Formik } from 'formik';
import { render, act } from '@testing-library/react-native';

describe('PanelHeader', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <Formik initialValues={{ fields: { status: 'In Progress', transactionRep: { Name: 'transactionRepName' } } }}>
        <PanelHeader />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/In Progress/)).toBeTruthy();
    expect(getByText(/transactionRepName/)).toBeTruthy();
  });
});
