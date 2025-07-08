import React from 'react';
import PanelHeader from './PanelHeader';
import { Formik } from "formik";
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

    expect(getByText(/Transaction Date Time/)).toBeTruthy();
  });

  it('should render properly with user field', () => {
    const { getByText } = render(
      <Formik
        initialValues={{
          fields: {
            transactionDateTime: '',
            territory: {
              name: 'Test',
            },
            user: {
              Name: 'TestUserField'
            }
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/TestUserField/)).toBeTruthy();
  });

  it('should render properly without territory field', () => {
    const { getByText } = render(
      <Formik
        initialValues={{
          fields: {
            transactionDateTime: '',
            user: {
              Name: 'Test'
            }
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/Transaction Date Time/)).toBeTruthy();
  });

});
