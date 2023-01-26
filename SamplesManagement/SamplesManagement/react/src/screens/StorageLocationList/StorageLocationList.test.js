import React from 'react';
import StorageLocationList from './StorageLocationList';
import { useBanner, useFetcher, useBoolean } from '../../hooks';
import { IconButton, RadioButton, Button } from 'apollo-react-native';
import {
  deleteLocation,
  updateDefaultLocation,
} from '../../api/StorageLocation';
import { environment } from 'oce-apps-bridges';
import { Alert } from 'react-native';
import { render, act } from '@testing-library/react-native';

jest.mock('../../hooks/index');
jest.mock('../../api/StorageLocation');
jest.spyOn(Alert, 'alert');

let navigation;
const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  () => {},
];
describe('StorageLocationList', () => {
  beforeEach(() => {
    environment.userID = jest.fn().mockReturnValue('1');
    navigation = {
      addListener: jest.fn().mockImplementation((_, callback) => callback()),
      getParam: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValue(true),
      navigate: jest.fn(),
    };
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

  it('should render error', async () => {
    const { getByText } = render(
      <StorageLocationList navigation={navigation} />
    );

    expect(getByText(/error/)).toBeTruthy();
  });

  it('should render and trigger actions', async () => {
    const { container } = render(
      <StorageLocationList navigation={navigation} />
    );

    // press remove icon
    container.findAllByType(IconButton)[0].props.onPress();
    // press delete Alert button
    Alert.alert.mock.calls[0][2][1].onPress();
    expect(deleteLocation).toHaveBeenCalledTimes(1);
    // press remove icon
    container.findAllByType(IconButton)[0].props.onPress();
    // press cancel Alert button
    Alert.alert.mock.calls[1][2][0].onPress();
    expect(deleteLocation).toHaveBeenCalledTimes(1);

    // press edit should call navigate to StorageLocation screen
    container.findAllByType(IconButton)[1].props.onPress();
    expect(navigation.navigate).toHaveBeenCalledWith('StorageLocation', {
      locationId: '1',
    });

    // press Back button
    container.findAllByType(Button)[0].props.onPress();
    expect(navigation.navigate).toHaveBeenCalledWith('Dashboard', {
      refreshLocationWidget: false,
    });

    // press New button
    container.findAllByType(Button)[1].props.onPress();
    expect(navigation.navigate).toHaveBeenCalledWith('StorageLocation');

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
