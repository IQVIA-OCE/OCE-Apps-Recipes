import React, { useContext } from 'react';
import { act, render } from '@testing-library/react-native';
import {
  fetchActiveLotsProducts,
  fetchInventoryById,
} from '../../api/Inventories';
import InventoryContextProvider, { InventoryContext } from './InventoryContext';
import { Text } from 'react-native';
import { AppContext } from '../../AppContext';
import { customSettings } from '@oce-apps/oce-apps-bridges';
import { useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native');

describe('InventoryContext', () => {
  beforeAll(() => {
    customSettings.getCustomSetting.mockResolvedValue([{ Id: 1 }]);
  });
  beforeEach(() => {
    fetchInventoryById.mockClear();
  });

  it('should render properly with error', () => {
    useRoute.mockReturnValue({
      params: {
        id: '1'
      }
    });
    fetchActiveLotsProducts.mockRejectedValueOnce('error');

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
    act(() => jest.runAllTimers());

    expect(getByText(/ContextError/)).toBeTruthy()
  });

  it('should render with create type', () => {
    useRoute.mockReturnValue({
      params: {}
    });

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

    render(<Component />);
    act(() => jest.runAllTimers());

    expect(fetchInventoryById).not.toHaveBeenCalled()
  });

  it('should render with edit type', () => {
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

    render(<Component />);
    act(() => jest.runAllTimers());

    expect(fetchInventoryById).toHaveBeenCalledTimes(1);
  });
});
