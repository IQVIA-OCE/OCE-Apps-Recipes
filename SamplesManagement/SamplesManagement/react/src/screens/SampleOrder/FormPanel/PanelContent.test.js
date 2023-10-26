import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { useFetcher, useHandleData } from '../../../hooks';
import { render } from '@testing-library/react-native';
import { getFieldHelperText } from '../utils';

jest.mock('../utils');
jest.mock('../../../hooks')

describe('PanelContent', () => {
  beforeEach(() => {
    useFetcher.mockReturnValue([
      {
        data: [],
        loading: false,
      },
      { handleFetch: jest.fn() },
    ]);

    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });
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
    )

    expect(getByTestId('PanelContent')).toBeTruthy();
  });

  it('should render errors', async () => {
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

    expect(getByText('error text')).toBeTruthy();
  });
});
