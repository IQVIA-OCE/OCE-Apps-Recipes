import React from 'react';
import { act, render } from '@testing-library/react-native';
import InventoryScreenContainer from './InventoryScreenContainer';
import { useRoute } from '@react-navigation/native';


jest.mock('@react-navigation/native');
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

useRoute.mockReturnValue({
  params: {
    recordType: 'AdHocInventory'
  }
});

describe('InventoryScreenContainer', () => {
  it('should render properly', () => {
    const { getByText} = render(<InventoryScreenContainer />)
    act(() => jest.runAllTimers());

    expect(getByText(/Inventory Date Time/)).toBeTruthy();
  });
});
