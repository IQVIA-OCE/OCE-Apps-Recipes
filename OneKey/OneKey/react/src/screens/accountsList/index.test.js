import React from 'react';
import AccountsScreen from './index';
import { databaseManager } from 'oce-apps-bridges';
import { act, render } from "@testing-library/react-native";
import { Provider, DarkTheme } from 'apollo-react-native';
import { FlatList } from "react-native";

jest.useFakeTimers();

const MockOneKeyData = {
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
  'size': 2
}


describe('AccountsList', () => {
  beforeAll(() => {
    databaseManager.fetch = jest.fn()
      .mockResolvedValueOnce(MockOneKeyData)
      .mockResolvedValueOnce(MockOneKeyData)
      .mockResolvedValueOnce(MockOneKeyData)
      .mockRejectedValueOnce({ message: 'Error' })
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should render AccountsList component', () => {
    const tree = render(
        <AccountsScreen/>
    );

    expect(tree).toBeTruthy();
  });

  it('Should render AccountsList component  in dark mode', () => {
    const tree = render(
        <Provider theme={DarkTheme}>
          <AccountsScreen/>
        </Provider>
    );

    expect(tree).toBeTruthy();
  });

  it('call loadMore', async () => {
    const dataSpy = jest
        .spyOn(databaseManager, "fetch")
        .mockResolvedValue(MockOneKeyData);
    jest.spyOn(databaseManager, "fetch").mockResolvedValue({totalSize: 2});
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);

    const flatListComponent = UNSAFE_getByType(FlatList);

    act(() => {
      flatListComponent.props.onEndReached();
    });

    await act(() => promise);

    expect(dataSpy).toHaveBeenCalled();
  });

  it("should handle query errors", async () => {
    jest
        .spyOn(databaseManager, "fetch")
        .mockRejectedValueOnce(new Error("Error"));
    jest.spyOn(databaseManager, "fetch").mockResolvedValue({totalSize: 2});
    render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);
  });
});
