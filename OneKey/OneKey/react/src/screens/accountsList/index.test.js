import React from 'react';
import renderer from 'react-test-renderer';
import AccountsList from './index';
import { FlatList } from 'react-native';
import DatabaseManagerMock from '../../../__mocks__/Database/DatabaseManager'

const value = {
  'queryLocator': '2296140F-4D6F-4738-AF29-1DF861509367',
  'done': false,
  'records': [
    {
      'Name': 'AARON RANDELL BOWEN',
      'Id': '0019D000006hahVQAQ',
      'LastName': 'BOWEN',
      'Phone': null,
      'MiddleName': 'RANDELL',
      'OCE__Specialty__c': 'Internal medicine',
      'OCE__AccountFullName__c': null,
      'OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c': '260 FAIRHILL DR',
      'OCE__PrimaryAccountAddress__r.OCE__City__c': 'OROVILLE',
      'FirstName': 'AARON',
      'OCE__RecordTypeName__c': null
    },
    {
      'MiddleName': 'H',
      'OCE__AccountFullName__c': null,
      'OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c': '670 PONAHAWAI ST STE 223',
      'OCE__RecordTypeName__c': null,
      'FirstName': 'AARON',
      'OCE__PrimaryAccountAddress__r.OCE__City__c': 'HILO',
      'OCE__Specialty__c': 'Internal medicine',
      'Id': '0019D000006hahRQAQ',
      'Phone': '8089355411',
      'LastName': 'MORITA',
      'Name': 'AARON H MORITA'
    }
  ],
  'size': 0
}


describe('AccountsList', () => {
  beforeAll(() => {
    DatabaseManagerMock.fetch = jest.fn()
      .mockResolvedValueOnce(value)
      .mockResolvedValueOnce(value)
      .mockResolvedValueOnce(value)
      .mockRejectedValueOnce({ message: 'Error' })
      .mockRejectedValueOnce({ message: 'Error' })
      .mockRejectedValueOnce({ message: 'Error' })
      .mockRejectedValueOnce({ message: 'Error' })
  });

  it('Should render AccountsList component', () => {
    const tree = renderer
      .create(
        <AccountsList/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('call loadMore', () => {
    const tree = renderer
      .create(
        <AccountsList/>
      );

    const instance = tree.getInstance();

    instance.state.loading = false;
    instance.state.fetchDone = false;
    instance.state.queryLocator = '2296140F-4D6F-4738-AF29-1DF861509367';

    tree.root.findByType(FlatList).props.onEndReached();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('call loadMore with loading state', () => {
    const tree = renderer
      .create(
        <AccountsList/>
      );

    const instance = tree.getInstance();

    instance.state.loading = true;
    instance.state.fetchDone = true;
    instance.state.queryLocator = null;

    tree.root.findByType(FlatList).props.onEndReached();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('call loadMore with no queryLocator', () => {
    const tree = renderer
      .create(
        <AccountsList/>
      );

    const instance = tree.getInstance();

    instance.state.loading = false;
    instance.state.fetchDone = false;
    instance.state.queryLocator = null;

    instance.loadMore();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('call loadMore with fetch error', () => {
    const tree = renderer
      .create(
        <AccountsList/>
      );

    const instance = tree.getInstance();

    instance.state.loading = false;
    instance.state.fetchDone = false;
    instance.state.queryLocator = '2296140F-4D6F-4738-AF29-1DF861509367';

    tree.root.findByType(FlatList).props.onEndReached();
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
