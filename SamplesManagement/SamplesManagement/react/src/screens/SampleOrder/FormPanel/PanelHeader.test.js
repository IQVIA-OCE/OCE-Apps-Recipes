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
            status: 'In Progress',
            user: { Name: 'name' },
            territory: { name: 'name' },
            isUrgent: false
          },
        }}
      >
        <PanelHeader />
      </Formik>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
