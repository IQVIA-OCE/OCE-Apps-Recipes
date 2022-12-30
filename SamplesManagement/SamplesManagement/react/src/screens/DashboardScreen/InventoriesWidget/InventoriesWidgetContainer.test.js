import React from 'react';
import InventoriesWidgetContainer from './InventoriesWidgetContainer';
import { useFetcher, useHandleData } from '../../../hooks';
import { render, act } from '@testing-library/react-native';

jest.mock('../../../hooks');

const navigation = {
  addListener: jest.fn(),
};

describe('InventoriesWidgetContainer', () => {
  beforeAll(() => {
    useFetcher
      .mockReturnValueOnce([
        { loading: false, error: 'Error text'},
        { handleFetch: jest.fn() },
      ])
      .mockReturnValue([
        { loading: false, data: { all: [] } },
        { handleFetch: jest.fn() },
      ]);

    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });

  it('Should render InventoriesWidgetContainer error', async () => {
    const promise = Promise.resolve();
    const { getByText } = render(
      <InventoriesWidgetContainer navigation={navigation} />
    )

    await act(() => promise);
    expect(getByText(/Error text/)).toBeTruthy();
  });

  it('Should render InventoriesWidgetContainer component', () => {
    const { getAllByText } = render(<InventoriesWidgetContainer navigation={navigation} />)

    expect(getAllByText(/Inventories/)).toBeTruthy();
  });
});
