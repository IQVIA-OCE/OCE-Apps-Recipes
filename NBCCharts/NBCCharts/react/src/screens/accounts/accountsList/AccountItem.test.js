import React from "react";
import { render, act } from "@testing-library/react-native";
import AccountItem from "./AccountItem";
import { IconButton } from "apollo-react-native";
import { navigator } from "oce-apps-bridges";
import * as constants from "../../../constants";

const accountItemData = {
  Id: "a1j2D000000MNHhQAO2",
  OCE__Rank__c: 10,
  attributes: {
    type: "OCE__NextBestCustomer__c",
    url:
      "/services/data/v43.0/sobjects/OCE__NextBestCustomer__c/a1j2D000000MNHhQAO"
  },
  OCE__TotalScore__c: 0,
  OCE__NbcData__c:
    '{"scores":{"isTarget":0,"recentlyCalled":0},"metrics":{"isTarget":false,"recentlyCalled":"DATA_NOT_AVAILABLE"},"customLabels":{}}',
  index: 10,
  OCE__Account__r: {
    Id: "123",
    Name: "Account Name",
    OCE__CountryCode__c: "testAccountCode",
    OCE__PrimaryAccountAddress__r: {
      OCE__Address__r: {
        OCE__DisplayAddress__c: "Account Address 1"
      }
    }
  }
};

const columns = [
  {
    accessor: "Id"
  },
  {
    title: "Rank",
    accessor: "OCE__Rank__c",
    type: "number"
  }
];

const createTestProps = props => ({
  navigation: {
    push: jest.fn()
  },
  ...props
});

describe("AccountItem", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    navigator.dispatch.mockResolvedValue({});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render properly on Ipad", () => {
    constants.isIphone = false;

    const { getByText } = render(
      <AccountItem itemData={accountItemData} columns={columns} />
    );

    const accountNameEl = getByText("Account Name");
    const accountAddressEl = getByText("Account Address 1");
    const idEl = getByText("a1j2D000000MNHhQAO2");
    const rankEl = getByText("10th");

    expect(accountNameEl).toBeTruthy();
    expect(accountAddressEl).toBeTruthy();
    expect(idEl).toBeTruthy();
    expect(rankEl).toBeTruthy();
  });

  it("should render properly on iPhone", () => {
    const { getByText } = render(
      <AccountItem itemData={accountItemData} columns={columns} />
    );

    const accountNameEl = getByText("Account Name");
    const accountAddressEl = getByText("Account Address 1");
    const idEl = getByText("a1j2D000000MNHhQAO2");
    const rankEl = getByText("10th");

    expect(accountNameEl).toBeTruthy();
    expect(accountAddressEl).toBeTruthy();
    expect(idEl).toBeTruthy();
    expect(rankEl).toBeTruthy();
  });

  it("should call buttons onPress", () => {
    const props = createTestProps({});
    const { UNSAFE_getAllByType } = render(
      <AccountItem itemData={accountItemData} columns={columns} {...props} />
    );

    const iconButtons = UNSAFE_getAllByType(IconButton);

    // go to Customer Details button
    act(() => {
      iconButtons[0].props.onPress();
    });

    expect(props.navigation.push).toHaveBeenCalledWith("AccountInfo", {
      accountName: "Account Name",
      countryCode: "testAccountCode"
    });

    // go to Account Info button
    act(() => {
      iconButtons[1].props.onPress();
    });

    expect(navigator.dispatch).toHaveBeenCalledWith({
      id: "123",
      mode: "view",
      params: undefined,
      presentationMode: undefined
    });

    // Log a call button
    act(() => {
      iconButtons[2].props.onPress();
    });

    expect(navigator.dispatch).toHaveBeenLastCalledWith({
      mode: "new",
      entity: "OCE__Call__c",
      id: undefined,
      parentID: "123",
      componentName: undefined,
      presentationMode: undefined,
      params: undefined
    });
  });
});
