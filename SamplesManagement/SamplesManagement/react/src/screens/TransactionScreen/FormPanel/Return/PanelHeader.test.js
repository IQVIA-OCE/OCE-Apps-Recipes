import React from 'react';
import PanelHeader from './PanelHeader';
import renderer from 'react-test-renderer';
import moment from 'moment';
import { Formik } from 'formik';

jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm'}));

describe('PanelHeader', () => {
  it('should render properly', () => {
    let tree = renderer.create(
      <Formik initialValues={{ fields: { status: 'In Progress' } }}>
        <PanelHeader />
      </Formik>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
