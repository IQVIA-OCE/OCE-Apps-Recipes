import renderer from "react-test-renderer";
import { Formik } from "formik";
import PanelHeader from "./PanelHeader";
import React from "react";

describe('PanelHeader', () => {
  it('should render properly', () => {
    let tree = renderer.create(
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

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render properly with user field', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          fields: {
            transactionDateTime: '',
            territory: {
              name: 'Test',
            },
            user: {
              Name: 'Test'
            }
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render properly without territory field', () => {
    let tree = renderer.create(
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

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
