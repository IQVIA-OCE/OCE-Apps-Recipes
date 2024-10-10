import React from 'react';
import ManageLotsWidget from './ManageLotsWidget';
import { BannerContext } from '../BannerContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { render, act, fireEvent } from '@testing-library/react-native';
import { fetchLots } from '../../../api/ManageLots';

jest.mock('@react-navigation/native');

const mockedNavigate = jest.fn();

useNavigation.mockImplementation(() => ({
  addListener: jest.fn().mockImplementation((_, fn) => fn()),
  getParam: jest
    .fn()
    .mockImplementation(() => false),
  navigate: mockedNavigate,
}));

useRoute.mockReturnValue({
  params: {
    refreshLotsWidget: false
  }
});

describe('ManageLotsWidget', () => {
  it('should render component', () => {
    const { getByText } = render(
      <BannerContext.Provider value={[{}, jest.fn()]}>
        <ManageLotsWidget />
      </BannerContext.Provider>
    );
    act(() => jest.runAllTimers());

    fireEvent.press(getByText(/View all/i));
    expect(mockedNavigate).toHaveBeenCalledWith('ManageLots');
    expect(getByText(/6543-1/)).toBeTruthy();
  });

  it('should render empty component message', () => {
    fetchLots.mockResolvedValueOnce([[]]);
    const { getByText } = render(
      <BannerContext.Provider value={[{}, jest.fn()]}>
        <ManageLotsWidget />
      </BannerContext.Provider>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/No active Lots available./)).toBeTruthy();
  });
});
