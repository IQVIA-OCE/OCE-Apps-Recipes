import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { act, render } from '@testing-library/react-native';
import { getFieldHelperText } from '../utils';

jest.mock('../utils');

describe('PanelContent', () => {
  it('should render properly', () => {
    const { getByTestId } = render(
      <Formik
        initialValues={{
          fields: {
            shipTo: '',
            comments: '',
          },
        }}
      >
        <PanelContent readonly={false}/>
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByTestId('PanelContent')).toBeTruthy();
  });

  it('should render errors', () => {
    const mockSubmit = jest.fn();

    getFieldHelperText.mockImplementation(() => 'error text');

    const Component = () => (
      <Formik
        initialErrors={{
          shipTo: 'error'
        }}
        initialValues={{
          fields: {
            shipTo: '',
            comments: '',
            user: {
              Id: "0050k000004CineAAC"
            }
          },
        }}
        onSubmit={mockSubmit}
        validate={() => ({
          fields: {
            shipTo: 'error',
            comments: 'error',
          },
        })}
      >
        <PanelContent />
      </Formik>
    );
    const { getByText } = render(<Component />);
    act(() => jest.runAllTimers());

    expect(getByText('error text')).toBeTruthy();
  });
});
