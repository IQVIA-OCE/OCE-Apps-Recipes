import React from 'react';
import renderer from 'react-test-renderer';
import InventoriesWidgetContainer from './InventoriesWidgetContainer';
import { useFetcher, useHandleData } from '../../../hooks';

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

  it('Should render InventoriesWidgetContainer error', () => {
    const tree = renderer
      .create(<InventoriesWidgetContainer navigation={navigation} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Should render InventoriesWidgetContainer component', () => {
    const tree = renderer
      .create(<InventoriesWidgetContainer navigation={navigation} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
