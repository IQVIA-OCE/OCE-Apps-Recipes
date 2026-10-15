import React from 'react';
import StorageLocationList from './StorageLocationList';
import { useBanner } from '../../hooks';
import { IconButton, RadioButton, Button } from '@oce-apps/apollo-react-native';
import {
  updateDefaultLocation,
  fetchLocationsList,
} from '../../api/StorageLocation';
import { Alert, Platform } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('../../hooks/useBanner');
jest.spyOn(Alert, 'alert');

jest.mock('@react-navigation/native');

const mockedNavigate = jest.fn();

const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  () => {
  },
];

describe('StorageLocationList', () => {
  beforeEach(() => {
    useNavigation.mockImplementation(() => ({
      addListener: jest.fn().mockImplementation((_, callback) => callback()),
      navigate: mockedNavigate,
    }));

    useRoute
      .mockReturnValueOnce({
        params: {
          refresh: false,
        },
      })
      .mockReturnValue({
        params: {
          refresh: true,
        },
      });

    useRoute.mockImplementation(() => ({
      params: {
        refresh: jest.fn().mockReturnValueOnce(false)
          .mockReturnValue(true),
      },
    }));

    useBanner.mockReturnValue(useBannerValue);
  });

  beforeAll(() => {
    Object.defineProperty(Platform, 'OS', { get: jest.fn(() => 'ios') });
  });

  it('should render error', () => {
    fetchLocationsList.mockRejectedValueOnce('error');
    const { getByText } = render(
      <StorageLocationList />,
    );
    act(() => jest.runAllTimers());

    expect(getByText(/error/)).toBeTruthy();
  });

  it('should render and trigger actions', () => {
    fetchLocationsList.mockResolvedValueOnce([[{
      'Id': '1',
      'OCE__IsDefaultStorageLocation__c': false,
      'OCE__FullAddress__c': 'address 1',
    }]]);
    const { UNSAFE_root } = render(
      <StorageLocationList />,
    );
    act(() => jest.runAllTimers());

    //ToDo: Upon adding alert polyfill it's not possible to test delete and cancel calls
    // press remove icon
    // UNSAFE_root.findAllByType(IconButton)[0].props.onPress();
    // press delete Alert button
    // Alert.alert.mock.calls[0][2][1].onPress();
    // expect(deleteLocation).toHaveBeenCalledTimes(1);

    // press remove icon
    // UNSAFE_root.findAllByType(IconButton)[0].props.onPress();
    // press cancel Alert button
    // Alert.alert.mock.calls[1][2][0].onPress();
    // expect(deleteLocation).toHaveBeenCalledTimes(1);

    // press edit should call navigate to StorageLocation screen
    fireEvent.press(UNSAFE_root.findAllByType(IconButton)[1]);
    expect(mockedNavigate).toHaveBeenCalledWith('StorageLocation', {
      locationId: '1',
    });

    // press Back button
    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    expect(mockedNavigate).toHaveBeenCalledWith('Dashboard', {
      refreshLocationWidget: false,
    });

    // press New button
    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    expect(mockedNavigate).toHaveBeenCalledWith('StorageLocation');

    // default location changed successfully
    fireEvent(UNSAFE_root.findByType(RadioButton), 'change');
    expect(updateDefaultLocation).toHaveBeenCalledTimes(1);
    expect(updateDefaultLocation).toHaveBeenCalledWith('1');

    // default location changed error
    updateDefaultLocation.mockRejectedValue('error');
    fireEvent(UNSAFE_root.findByType(RadioButton), 'change');
    act(() => jest.runAllTimers());
    expect(updateDefaultLocation).toHaveBeenCalledTimes(2);
  });
});
