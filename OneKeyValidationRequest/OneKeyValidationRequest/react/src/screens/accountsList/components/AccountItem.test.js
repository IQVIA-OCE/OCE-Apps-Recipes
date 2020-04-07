import React from 'react';
import renderer from 'react-test-renderer';
import AccountItem from './AccountItem';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

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
  it('Should render AccountItem component', () => {
    const tree = renderer
      .create(
        <AccountItem
          itemData={itemData}
        />
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
