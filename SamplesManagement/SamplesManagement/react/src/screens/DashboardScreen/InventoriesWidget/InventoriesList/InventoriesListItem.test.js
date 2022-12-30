import React from 'react';
import InventoriesListItem from './InventoriesListItem';
import { TouchableOpacity } from 'react-native';
import { render, act } from '@testing-library/react-native';

let item;

describe('InventoriesListItem', () => {
  beforeEach(() => {
    item = {
      OCE__SampleInventoryDetails__r: {
        totalSize: 1,
      },
      OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
      OCE__Status__c: 'Submitted',
      OCE__Reason__c: 'Test reason'
    };
  });

  it('Should render InventoriesListItem component', () => {
    const navigate = jest.fn();
    const { getByText, container } = render(
      <InventoriesListItem item={item} navigation={{ navigate }} />
    );

    act(() => {
      container.findAllByType(TouchableOpacity)[0].props.onPress();
    });

    expect(getByText(/Test reason/)).toBeTruthy();
    expect(navigate).toBeCalledTimes(1);
  });
});
