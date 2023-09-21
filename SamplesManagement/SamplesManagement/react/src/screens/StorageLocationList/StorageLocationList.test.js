import React from 'react';
import StorageLocationList from './StorageLocationList';
import { useBanner, useFetcher, useBoolean } from '../../hooks';
import { IconButton, RadioButton, Button } from 'apollo-react-native';
import {
  deleteLocation,
  updateDefaultLocation,
} from '../../api/StorageLocation';
import { environment } from 'oce-apps-bridges';
import { Alert, Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('../../hooks/index');
jest.mock('../../api/StorageLocation');
jest.spyOn(Alert, 'alert');

jest.mock('@react-navigation/native');

const mockedNavigate = jest.fn();

const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  () => {},
];
describe('StorageLocationList', () => {
  beforeEach(() => {
    environment.userID = jest.fn().mockReturnValue('1');

    useNavigation.mockImplementation(() => ({
      addListener: jest.fn().mockImplementation((_, callback) => callback()),
      navigate: mockedNavigate,
    }));

    useRoute
      .mockReturnValueOnce({
        params: {
          refresh: false
        }
      })
      .mockReturnValue({
        params: {
          refresh: true
        }
      });

    useRoute.mockImplementation(() => ({
      params: {
        refresh: jest.mockReturnValueOnce(false)
          .mockReturnValue(true)
      }
    }));

    useBoolean.mockReturnValue([false, { setTrue: jest.fn() }]);
    useFetcher
      .mockReturnValueOnce([
        { loading: false, data: [], error: 'error' },
        {
          handleFetch: jest.fn(),
          setValue: jest.fn(),
        },
      ])
      .mockReturnValueOnce([
        {
          loading: false,
          data: [{ address: 'address 1', isDefault: false, id: '1' }],
        },
        {
          handleFetch: jest.fn(),
          setValue: fn => fn(),
        },
      ]);
    useBanner.mockReturnValue(useBannerValue);
  });

  beforeAll(() => {
    Object.defineProperty(Platform, 'OS', { get: jest.fn(() => 'ios') })
  })

  it('should render error', async () => {
    const { getByText } = render(
      <StorageLocationList />
    );

    expect(getByText(/error/)).toBeTruthy();
  });

  it('should render and trigger actions', async () => {
    const { container } = render(
      <StorageLocationList />
    );
    
    //ToDo: Upon adding alert polyfill it's not possible to test delete and cancel calls
    // press remove icon
    // container.findAllByType(IconButton)[0].props.onPress();
    // press delete Alert button
    // Alert.alert.mock.calls[0][2][1].onPress();
    // expect(deleteLocation).toHaveBeenCalledTimes(1);

    // press remove icon
    // container.findAllByType(IconButton)[0].props.onPress();
    // press cancel Alert button
    // Alert.alert.mock.calls[1][2][0].onPress();
    // expect(deleteLocation).toHaveBeenCalledTimes(1);

    // press edit should call navigate to StorageLocation screen
    container.findAllByType(IconButton)[1].props.onPress();
    expect(mockedNavigate).toHaveBeenCalledWith('StorageLocation', {
      locationId: '1',
    });

    // press Back button
    container.findAllByType(Button)[0].props.onPress();
    expect(mockedNavigate).toHaveBeenCalledWith('Dashboard', {
      refreshLocationWidget: false,
    });

    // press New button
    container.findAllByType(Button)[1].props.onPress();
    expect(mockedNavigate).toHaveBeenCalledWith('StorageLocation');

    // default location changed successfully
    container.findByType(RadioButton).props.onPress();
    expect(updateDefaultLocation).toHaveBeenCalledTimes(1);
    expect(updateDefaultLocation).toHaveBeenCalledWith('1');

    // default location changed error
    updateDefaultLocation.mockRejectedValue('error');
    container.findByType(RadioButton).props.onPress();
    expect(updateDefaultLocation).toHaveBeenCalledTimes(2);
  });
});
