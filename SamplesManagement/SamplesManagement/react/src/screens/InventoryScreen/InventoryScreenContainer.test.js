import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import InventoryScreenContainer from './InventoryScreenContainer';
import { customSettings } from 'oce-apps-bridges';
import {
  fetchActiveLotsProducts,
  fetchInventoryTypes,
  fetchLastSubmittedInventory,
  fetchTransactionDetails
} from '../../api/Inventories';

jest.mock('../../api/Inventories');

jest.mock('oce-apps-bridges');

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

jest.mock('react-navigation', () => ({
  withNavigation: Component => props => (
    <Component navigation={{ navigate: jest.fn(), state: { params: { recordType: 'AddHocInventory' } } }} {...props} />
  ),
}));

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
