import { Formik } from "formik";
import PanelHeader from "./PanelHeader";
import React from "react";
import { render } from '@testing-library/react-native';

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
    )

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
              Name: 'userField'
            }
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );

    expect(getByText(/userField/)).toBeTruthy();
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

    expect(getByText(/Transaction Date Time/)).toBeTruthy();
  });
});
