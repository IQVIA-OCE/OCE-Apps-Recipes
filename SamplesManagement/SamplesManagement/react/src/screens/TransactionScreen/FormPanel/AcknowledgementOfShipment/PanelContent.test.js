import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import DateField from '../DateField';
import { Select } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
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
    act(() => jest.runAllTimers());

    expect(getByText(/Received Date/)).toBeTruthy();
  });

  it('should render errors', () => {
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
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(DateField), 'onChange', 'asdf');
    fireEvent(UNSAFE_root.findByType(Select), 'onChange', 'asdf')
    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit');
    act(() => jest.runAllTimers());

    expect(getAllByText(/error/)).toBeTruthy();
  });
});
