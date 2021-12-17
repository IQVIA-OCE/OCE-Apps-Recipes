import React from 'react';
import renderer, { act } from 'react-test-renderer';
import RecordTypeSelectorScreen from './RecordTypeSelectorScreen';
import { useFetcher, useHandleData } from '../../hooks';
import { Button } from 'apollo-react-native';

jest.mock('../../hooks');

const navigation = {
  navigate: jest.fn(),
};
const recordType = {
  Description: 'Record Type to differentiate Acknowledgement of Shipment',
  DeveloperName: 'AcknowledgementOfShipment',
  Name: 'Acknowledgement of Shipment',
};
describe('RecordTypeSelectorScreen', () => {
  beforeEach(() => {
    useFetcher
      .mockReturnValueOnce([
        {
          data: [recordType],
        },
      ])
      .mockReturnValueOnce([{ data: [] }]);
  });
  useHandleData.mockImplementation(data => fn => fn(data.data));
  it('should render component', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <RecordTypeSelectorScreen navigation={navigation} />
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();

    tree.root.findAllByType(Button)[0].props.onPress();
    expect(navigation.navigate).toBeCalledWith('Dashboard');

    tree.root.findAllByType(Button)[1].props.onPress();
    expect(navigation.navigate).toBeCalledWith('Transaction', {
      recordType,
    });
  });

  it('should render component without data', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <RecordTypeSelectorScreen navigation={navigation} />
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
