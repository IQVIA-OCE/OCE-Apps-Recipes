import React from 'react';
import PanelHeader from './PanelHeader';
import { Formik } from 'formik';
import { render } from '@testing-library/react-native';

describe('PanelHeader', () => {
  it('should render properly', () => {
    const { getByTestId } = render(
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
    )

    expect(getByTestId('PanelHeader')).toBeTruthy();
  });
});
