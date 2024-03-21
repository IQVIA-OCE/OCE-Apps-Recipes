import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import InventoryScreenContainer from './InventoryScreenContainer';
import { customSettings } from '@oce-apps/oce-apps-bridges';
import {
  fetchActiveLotsProducts,
  fetchInventoryTypes,
  fetchLastSubmittedInventory,
  fetchTransactionDetails
} from '../../api/Inventories';
import { useRoute } from '@react-navigation/native';

jest.mock('../../api/Inventories');

jest.mock('@oce-apps/oce-apps-bridges');
jest.mock('@react-navigation/native');
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

useRoute.mockReturnValue({
  params: {
    recordType: 'AddHocInventory'
  }
});

describe('InventoryScreenContainer', () => {
  beforeAll(() => {
    fetchInventoryTypes.mockResolvedValue([[{
      Id: '1',
      DeveloperName: 'AdHocInventory'
    }]]);

    fetchLastSubmittedInventory.mockResolvedValue([{
      Id: '0',
      createdDate: '123'
    }]);

    fetchTransactionDetails.mockResolvedValue([[]]);
    fetchActiveLotsProducts.mockResolvedValue([[]]);
  })
  it('should render properly', async () => {
    customSettings.getCustomSetting.mockReturnValue({});

    const { getByText} = render(<InventoryScreenContainer />)

    await waitFor(() => {
      expect(getByText(/Inventory Date Time/)).toBeTruthy();
    });
  });
});
