import React from 'react';
import PanelHeader from './PanelHeader';
import { Formik } from 'formik';
import renderer from 'react-test-renderer';

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

  it('should render with transactionRep', () => {
    let tree = renderer.create(
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

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
