import React from 'react';
import StorageLocationWidget from './StorageLocationWidget';
import { environment } from 'oce-apps-bridges';
import { useFetcher, useHandleData } from '../../../hooks';
import {IconButton} from "apollo-react-native";
import { render, act } from '@testing-library/react-native';

jest.mock('../../../hooks');
jest.mock('../../../api/StorageLocation');

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => fn()),
  getParam: jest
    .fn()
    .mockImplementationOnce(() => false)
    .mockImplementationOnce(() => true),
  navigate: jest.fn(),
};

let handleFetch;

describe('StorageLocationWidget', () => {
  beforeEach(() => {
    handleFetch = jest.fn();
    environment.userID = jest.fn().mockReturnValue('1');
    useFetcher.mockReturnValueOnce(['Default address 1', { handleFetch }]);
    useHandleData.mockImplementation(d => fn => fn(d));
  });

  it('Should render StorageLocationWidget component', async () => {
    const promise = Promise.resolve();
    const { getByTestId, container } = render(
      <StorageLocationWidget navigation={navigation} />
    );

    await act(() => promise);

    expect(getByTestId('StorageLocationWidget')).toBeTruthy();

    container.findByType(IconButton).props.onPress();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('Should refresh default address', async () => {
    const promise = Promise.resolve();
    const { getByTestId } = render(
      <StorageLocationWidget navigation={navigation} />
    );

    await act(() => promise);
    expect(getByTestId('StorageLocationWidget')).toBeTruthy();
    expect(handleFetch).toHaveBeenCalled();
  });
});
