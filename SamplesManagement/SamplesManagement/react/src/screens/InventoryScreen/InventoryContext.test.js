import React, { useContext } from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { normalizer } from '../../utils/utils';
import {
  fetchActiveLotsProducts,
  fetchInventoryDetail,
  fetchLastSubmittedInventory,
  fetchTransactionDetails,
  fetchInventoryTypes,
  fetchInventoryById,
} from '../../api/Inventories';
import InventoryContextProvider, { InventoryContext } from './InventoryContext';
import { Text } from 'react-native';
import { AppContext } from '../../AppContext';
import { normalizeProductsList } from './utils';
import { customSettings } from 'oce-apps-bridges';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';

jest.mock('../../api/Inventories');
jest.mock('../../utils/utils');
jest.mock('./utils');
jest.mock('moment');
jest.mock('oce-apps-bridges');
jest.mock('@react-navigation/native');

describe('InventoryContext', () => {
  beforeAll(() => {
    moment.mockReturnValue('2020-11-23T18:43:24.926Z');
    customSettings.getCustomSetting.mockResolvedValue([{ Id: 1 }]);
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
  });

  it('should render properly with error', async () => {
    useRoute.mockReturnValue({
      params: {
        id: '1'
      }
    })

    const InnerComponent = () => {
      const context = useContext(InventoryContext);

      if (context.error) return <Text>ContextError</Text>

      return null;
    };

    const Component = () => (
      <AppContext.Provider value={{}}>
        <InventoryContextProvider>
          <InnerComponent />
        </InventoryContextProvider>
      </AppContext.Provider>
    );

    const { getByText } = render(<Component />);

    await waitFor(() => {
      expect(getByText(/ContextError/)).toBeTruthy()
    })
  });

  it('should render with create type', async () => {
    useRoute.mockReturnValue({
      params: {}
    })

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

    const tree = render(<Component />);

    expect(fetchInventoryById).toHaveBeenCalledTimes(0)
  });

  it('should render with edit type', async () => {
    useRoute.mockReturnValue({
      params: {
        id: '1'
      }
    })

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

    const tree = render(<Component />);

    await waitFor(() => {
      expect(fetchInventoryById).toHaveBeenCalled();
    })
  });
});
