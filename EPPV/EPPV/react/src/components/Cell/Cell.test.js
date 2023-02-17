import React from 'react';
import { render } from '@testing-library/react-native';
import { Cell } from './Cell';
import { Text } from 'apollo-react-native';
import * as helpers from '../../utils/common';


jest.mock('oce-apps-bridges', () => ({
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
    const { queryByText, container } = render(<Cell data={data} />);

    expect(queryByText(/Name 1/)).toBeTruthy();
    expect(container.findAllByType(Text).length).toEqual(4);
  });

  it('should render Cell  properly on iPhone', async () => {
    helpers.isIphone = false;

    const data = [
      {
        label: 'Name 1',
        value: 'Description 1',
      }
    ];
    const { queryByText, container } = render(<Cell data={data} />);

    expect(queryByText(/Description 1/)).toBeTruthy();
    expect(container.findAllByType(Text).length).toEqual(2);
  });
});
