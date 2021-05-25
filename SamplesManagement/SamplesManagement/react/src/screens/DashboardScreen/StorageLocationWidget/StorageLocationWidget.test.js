import React from 'react';
import renderer, { act } from 'react-test-renderer';
import StorageLocationWidget from './StorageLocationWidget';
import { environment } from '../../../../bridge/EnvironmentData/EnvironmentData.native';
import { useFetcher, useHandleData } from '../../../hooks';
import {IconButton} from "apollo-react-native";

jest.mock('../../../../bridge/EnvironmentData/EnvironmentData.native');
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
    const tree = renderer.create(
      <StorageLocationWidget navigation={navigation} />
    );

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();

    tree.root.findByType(IconButton).props.onPress();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('Should refresh default address', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <StorageLocationWidget navigation={navigation} />
    );

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(handleFetch).toHaveBeenCalledWith();
  });
});
