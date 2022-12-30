import React from 'react';
import StorageLocationList from './StorageLocationList';
import renderer, { act } from 'react-test-renderer';
import { useBanner, useFetcher, useBoolean } from '../../hooks';
import { IconButton, RadioButton, Button } from 'apollo-react-native';
import {
  deleteLocation,
  updateDefaultLocation,
} from '../../api/StorageLocation';
import { environment } from 'oce-apps-bridges';
import { Alert } from 'react-native';

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
    const tree = renderer.create(
      <StorageLocationList navigation={navigation} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render and trigger actions', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <StorageLocationList navigation={navigation} />
    );

    // press remove icon
    tree.root.findAllByType(IconButton)[0].props.onPress();
    // press delete Alert button
    Alert.alert.mock.calls[0][2][1].onPress();
    expect(deleteLocation).toHaveBeenCalledTimes(1);
    // press remove icon
    tree.root.findAllByType(IconButton)[0].props.onPress();
    // press cancel Alert button
    Alert.alert.mock.calls[1][2][0].onPress();
    expect(deleteLocation).toHaveBeenCalledTimes(1);

    // press edit should call navigate to StorageLocation screen
    tree.root.findAllByType(IconButton)[1].props.onPress();
    expect(navigation.navigate).toHaveBeenCalledWith('StorageLocation', {
      locationId: '1',
    });

    // press Back button
    tree.root.findAllByType(Button)[0].props.onPress();
    expect(navigation.navigate).toHaveBeenCalledWith('Dashboard', {
      refreshLocationWidget: false,
    });

    // press New button
    tree.root.findAllByType(Button)[1].props.onPress();
    expect(navigation.navigate).toHaveBeenCalledWith('StorageLocation');

    // default location changed successfully
    tree.root.findByType(RadioButton).props.onPress();
    expect(updateDefaultLocation).toHaveBeenCalledTimes(1);
    expect(updateDefaultLocation).toHaveBeenCalledWith('1');

    // default location changed error
    updateDefaultLocation.mockRejectedValue('error');
    tree.root.findByType(RadioButton).props.onPress();
    expect(updateDefaultLocation).toHaveBeenCalledTimes(2);

    await act(() => promise);
    // to match snapshot
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
