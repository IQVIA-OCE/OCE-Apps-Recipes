import React from 'react';
import InventoriesListItem from './InventoriesListItem';
import { TouchableOpacity } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { NAMESPACE } from '../../../../constants/constants';

jest.mock('@react-navigation/native');

const mockedNavigate = jest.fn();

useNavigation.mockImplementation(() => ({
  navigate: mockedNavigate
}));

let item;

describe('InventoriesListItem', () => {
  beforeEach(() => {
    item = {
      [`${NAMESPACE}SampleInventoryDetails__r`]: {
        totalSize: 1,
      },
      [`${NAMESPACE}InventoryDateTime__c`]: '2020-03-13T16:53:50.000Z',
      [`${NAMESPACE}Status__c`]: 'Submitted',
      [`${NAMESPACE}Reason__c`]: 'Test reason'
    };
  });

  it('Should render InventoriesListItem component', () => {
    const { getByText, UNSAFE_root } = render(
      <InventoriesListItem item={item} />
    );

    act(() => {
      UNSAFE_root.findAllByType(TouchableOpacity)[0].props.onPress();
    });

    expect(getByText(/Test reason/)).toBeTruthy();
    expect(mockedNavigate).toBeCalledTimes(1);
  });
});
