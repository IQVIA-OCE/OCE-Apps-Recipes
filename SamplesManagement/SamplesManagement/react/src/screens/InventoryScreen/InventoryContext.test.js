import React, { useContext } from 'react';
import renderer, { act } from 'react-test-renderer';
import { normalizer } from '../../utils/utils';

import {
  fetchActiveLotsProducts,
  fetchConfigs,
  fetchInventoryDetail,
  fetchLastSubmittedInventory,
  fetchTransactionDetails,
  fetchInventoryTypes,
  fetchInventoryById,
} from '../../api/Inventories';
import InventoryContextProvider, { InventoryContext } from './InventoryContext';
import { View, Text } from 'react-native';
import { AppContext } from '../../../AppContext';
import { getConfig, normalizeProductsList } from './utils';
import moment from 'moment';

jest.mock('../../api/Inventories');
jest.mock('../../utils/utils');
jest.mock('./utils');
jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native');
jest.mock('react-navigation', () => ({
  withNavigation: component => component,
}));
jest.mock('moment');

describe('InventoryContext', () => {
  beforeAll(() => {
    moment.mockReturnValue('2020-11-23T18:43:24.926Z');
    fetchConfigs.mockReturnValue([[{ Id: 1 }]]);
    fetchInventoryTypes.mockReturnValue([[{ Id: 1 }]]);
    fetchInventoryById.mockReturnValue([[{ Id: 1 }]]);
    fetchLastSubmittedInventory
      .mockReturnValue([[{ Id: 1 }]])
      .mockReturnValueOnce([]);
    fetchInventoryDetail.mockReturnValue([[{ Id: 1 }]]);
    fetchTransactionDetails.mockReturnValue([[{ Id: 1 }]]);
    fetchActiveLotsProducts.mockReturnValue([[{ Id: 1 }]]);
    normalizer.mockImplementation(() => data => data);
    normalizeProductsList.mockImplementation((pr, data) => [pr, data]);
    getConfig.mockImplementation(configs => configs[0]);
  });
  it('should render properly with error', async () => {
    const promise = Promise.resolve();
    let tree;
    const Component = () => (
      <AppContext.Provider value={{}}>
        <InventoryContextProvider navigation={{ state: { params: { id: 1 } } }}>
          <View>
            <Text>Inventory</Text>
          </View>
        </InventoryContextProvider>
      </AppContext.Provider>
    );
    tree = renderer.create(<Component />);

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render with create type', async () => {
    const promise = Promise.resolve();
    let tree;
    const InnerComponent = () => {
      const context = useContext(InventoryContext);

      return <Text>{JSON.stringify({ context })}</Text>;
    };
    const Component = () => (
      <AppContext.Provider value={{}}>
        <InventoryContextProvider navigation={{ state: { params: {} } }}>
          <InnerComponent />
        </InventoryContextProvider>
      </AppContext.Provider>
    );
    tree = renderer.create(<Component />);

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render with edit type', async () => {
    const promise = Promise.resolve();
    let tree;
    const InnerComponent = () => {
      const context = useContext(InventoryContext);

      return <Text>{JSON.stringify({ context })}</Text>;
    };
    const Component = () => (
      <AppContext.Provider value={{}}>
        <InventoryContextProvider navigation={{ state: { params: {id: '1'} } }}>
          <InnerComponent />
        </InventoryContextProvider>
      </AppContext.Provider>
    );
    tree = renderer.create(<Component />);

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
