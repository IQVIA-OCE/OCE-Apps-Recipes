import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import DateField from '../DateField';
import { Select } from '@oce-apps/apollo-react-native';
import { render, act } from '@testing-library/react-native';
import { getFieldHelperText } from '../../utils';

jest.mock('../../utils');

describe('PanelContent', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <Formik
        initialValues={{
          fields: {
            conditionOfPackage: '',
            receivedDate: '',
            comments: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    expect(getByText(/Received Date/)).toBeTruthy();
  });

  it('should render errors', async () => {
    const mockSubmit = jest.fn();

    getFieldHelperText.mockReturnValue('error');

    const Component = () => (
      <Formik
        initialValues={{
          fields: {
            conditionOfPackage: '',
            receivedDate: '',
            comments: '',
          },
        }}
        onSubmit={mockSubmit}
        validate={() => ({
          fields: {
            conditionOfPackage: 'error',
            receivedDate: 'error',
            comments: 'error',
          },
        })}
      >
        <PanelContent />
      </Formik>
    );

    const { UNSAFE_root, getAllByText } = render(
      <Component />
    );

    await act(async () =>
      UNSAFE_root.findByType(DateField).props.onChange('asdf')
    );
    await act(async () => UNSAFE_root.findByType(Select).props.onChange('asdf'));
    await act(async () => UNSAFE_root.findByType(Formik).props.onSubmit());

    expect(getAllByText(/error/)).toBeTruthy();
  });
});
