import React from 'react';
import { render } from '@testing-library/react-native';
import { Cell } from './Cell';
import { Text } from '@oce-apps/apollo-react-native';
import * as helpers from '../../utils/common';


jest.mock('@oce-apps/oce-apps-bridges', () => ({
    environment: {
      namespace: jest.fn(),
      locale: () => ('test'),
    },
  }))

describe('Cell', () => {
  it('should render Cell  properly', async () => {
    const data = [
      {
        label: 'Name 1',
        value: 'Description 1',
      },
      {
        label: 'Name 2',
        value: 'Description 2',
      },
    ];
    const { getByText } = render(<Cell data={data} />);

    expect(getByText(/Name 1/)).toBeTruthy();
    expect(getByText(/Description 1/)).toBeTruthy();
    expect(getByText(/Name 2/)).toBeTruthy();
    expect(getByText(/Description 2/)).toBeTruthy();
  });

  it('should render Cell  properly on iPhone', async () => {
    helpers.isIphone = false;

    const data = [
      {
        label: 'Name 1',
        value: 'Description 1',
      }
    ];
    const { queryByText } = render(<Cell data={data} />);

    expect(queryByText(/Name 1/)).toBeTruthy();
    expect(queryByText(/Description 1/)).toBeTruthy();
  });
});
