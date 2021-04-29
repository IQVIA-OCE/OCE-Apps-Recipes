import React from 'react';
import PanelHeader from './PanelHeader';
import { Formik } from 'formik';
import renderer from 'react-test-renderer';

jest.mock('moment', () => () => ({ format: () => 'May 3, 2020 06:19 pm' }));

describe('PanelHeader', () => {
  it('should render properly', () => {
    let tree = renderer.create(
      <Formik
        initialValues={{
          fields: {
            transactionDateTime: '',
            status: 'InProgress',
            transactionRep: { Name: 'name' },
            territory: { name: 'name' },
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render properly without transactionRep', () => {
    let tree = renderer.create(
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

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
