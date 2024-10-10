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
            territory: {
              name: 'Test'
            }
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/Transaction Date Time/)).toBeTruthy()
  });

  it('should render with transactionRep', () => {
    const { getByText } = render(
      <Formik
        initialValues={{
          fields: {
            transactionDateTime: '',
            transactionRep: {
              Name: 'Test'
            },
            territory: {
              name: 'Test'
            }
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/Test/)).toBeTruthy();
  });
});
