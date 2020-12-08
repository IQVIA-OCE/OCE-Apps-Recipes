import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InventoriesListItem from './InventoriesListItem';
import { TouchableOpacity } from 'react-native';

let item;

describe('InventoriesListItem', () => {
  beforeEach(() => {
    item = {
      OCE__SampleInventoryDetails__r: {
        totalSize: 1,
      },
      OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
      OCE__Status__c: 'Submitted',
    };
  });

  it('Should render InventoriesListItem component', () => {
    const navigate = jest.fn();
    const tree = renderer.create(
      <InventoriesListItem item={item} navigation={{ navigate }} />
    );

    act(() => {
      tree.root.findAllByType(TouchableOpacity)[0].props.onPress();
    });

    expect(navigate).toBeCalledTimes(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
