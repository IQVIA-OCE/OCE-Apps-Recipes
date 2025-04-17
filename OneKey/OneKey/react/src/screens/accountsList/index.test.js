import React from "react";
import AccountsScreen from "./index";
import { databaseManager } from "@oce-apps/oce-apps-bridges";
import { act, render } from "@testing-library/react-native";
import { Provider, DarkTheme } from "@oce-apps/apollo-react-native";
import { FlatList } from "react-native";

const MockOneKeyData = {
  queryLocator: "2296140F-4D6F-4738-AF29-1DF861509367",
  done: false,
  records: [
    {
      Name: "AARON RANDELL BOWEN",
      Id: "0019D000006hahVQAQ",
      LastName: "BOWEN",
      Phone: null,
      MiddleName: "RANDELL",
      OCE__Specialty__c: "Internal medicine",
      OCE__AccountFullName__c: null,
      OCE__PrimaryAccountAddress__r: {
        OCE__AddressLine1__c: "260 FAIRHILL DR",
        OCE__City__c: "OROVILLE",
      },
      FirstName: "AARON",
      OCE__RecordTypeName__c: null,
    },
    {
      MiddleName: "H",
      OCE__AccountFullName__c: null,
      OCE__RecordTypeName__c: null,
      FirstName: "AARON",
      OCE__Specialty__c: "Internal medicine",
      Id: "0019D000006hahRQAQ",
      Phone: "8089355411",
      LastName: "MORITA",
      Name: "AARON H MORITA",
      OCE__PrimaryAccountAddress__r: {
        OCE__AddressLine1__c: "670 PONAHAWAI ST STE 223",
        OCE__City__c: "HILO",
      },
    },
  ],
  size: 2,
};

describe("AccountsList", () => {
  beforeEach(() => {
    jest.useFakeTimers({advanceTimers: true});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should render AccountsList component", () => {
    jest.spyOn(databaseManager, "fetch").mockResolvedValueOnce(MockOneKeyData);

    const tree = render(<AccountsScreen />);
    act(() => jest.runAllTimers());

    expect(tree).toBeTruthy();
  });

  it("Should render AccountsList component  in dark mode", () => {
    jest.spyOn(databaseManager, "fetch").mockResolvedValueOnce(MockOneKeyData);

    const tree = render(
      <Provider theme={DarkTheme}>
        <AccountsScreen />
      </Provider>
    );
    act(() => jest.runAllTimers());

    expect(tree).toBeTruthy();
  });

  it("call loadMore", () => {
    jest
      .spyOn(databaseManager, "fetch")
      .mockResolvedValueOnce(MockOneKeyData)
      .mockResolvedValueOnce({
        ...MockOneKeyData,
        records: [
          ...MockOneKeyData.records
            .map(item => ({...item, Id: Math.random().toString(36).slice(2)}))
        ]
      });

    const { UNSAFE_getByType } = render(<AccountsScreen />);

    const flatListComponent = UNSAFE_getByType(FlatList);
    act(() => jest.runAllTimers());
    expect(databaseManager.fetch).toHaveBeenCalled()

    act(() => {
      flatListComponent.props.onEndReached();
    });

    act(() => jest.runAllTimers());

    expect(databaseManager.fetch).toHaveBeenLastCalledWith(MockOneKeyData.queryLocator);
  });

  it("should handle error during loading more", () => {
    jest
      .spyOn(databaseManager, "fetch")
      .mockResolvedValueOnce(MockOneKeyData)
      .mockRejectedValueOnce(new Error("Error"));
    const { UNSAFE_getByType } = render(<AccountsScreen />);
    act(() => jest.runAllTimers());

    const flatListComponent = UNSAFE_getByType(FlatList);

    act(() => {
      flatListComponent.props.onEndReached();
    });
    act(() => jest.runAllTimers());
  })

  it("should handle query errors", () => {
    jest
      .spyOn(databaseManager, "fetch")
      .mockRejectedValueOnce(new Error("Error"));
    render(<AccountsScreen />);
    act(() => jest.runAllTimers());
  });
});
