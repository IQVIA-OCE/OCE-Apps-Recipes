import React from 'react';
import renderer from 'react-test-renderer';
import InventoriesWidgetContainer from './InventoriesWidgetContainer';
import { useFetcher, useHandleData } from '../../../hooks';

jest.mock('../../../hooks');

describe('InventoriesWidgetContainer', () => {
  beforeEach(() => {
    useFetcher.mockReturnValue([{ loading: false, data: {} }]);
    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });
  it('Should render InventoriesWidgetContainer component', () => {
    const tree = renderer.create(<InventoriesWidgetContainer />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
