import React from 'react';
import renderer from 'react-test-renderer';
import AccountItem from './AccountItem';
import { IconButton } from 'apollo-react-native';
import { navigator } from "oce-apps-bridges";
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.useFakeTimers()

const itemData = {
  'Id': '0019D000006hacMQAQ',
  'OCE__Specialty__c': 'Family medicine',
  'Name': 'AZEEM M AHSAN',
  'OCE__AccountFullName__c': null,
  'MiddleName': 'M',
  'Phone': '8157412525',
  'LastName': 'AHSAN',
  'OCE__PrimaryAccountAddress__r.OCE__City__c': 'NEW LENOX',
  'OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c': '1900 SILVER CROSS BLVD',
  'OCE__RecordTypeName__c': null,
  'FirstName': 'AZEEM'
};

describe('AccountItem', () => {
  beforeAll(() => {
    navigator.dispatch = jest.fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce({})
      .mockRejectedValueOnce({})
  });

  it('Should render AccountItem component', () => {
    const tree = renderer
      .create(
        <AccountItem
          itemData={itemData}
        />
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should call IconButtons onPress function', () => {
    const tree = renderer
      .create(
        <AccountItem
          itemData={itemData}
          navigation={{ navigate: jest.fn() }}
        />
      );

    const components = tree.root.findAllByType(IconButton);
    components.forEach(el => {
      el.props.onPress()
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call IconButtons onPress function with errors', () => {
    const tree = renderer
      .create(
        <AccountItem
          itemData={itemData}
          navigation={{ navigate: jest.fn() }}
        />
      );

    const components = tree.root.findAllByType(IconButton);
    components.forEach(el => {
      el.props.onPress()
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
