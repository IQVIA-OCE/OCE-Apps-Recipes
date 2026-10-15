import React from "react";
import { render, fireEvent } from '@testing-library/react-native';
import AccountItem from "./AccountItem";
import { IconButton } from "@oce-apps/apollo-react-native";
import { externalNavigator, navigator } from '@oce-apps/oce-apps-bridges';
import * as constants from "../../../constants";
import { Platform } from 'react-native';

jest.mock("@oce-apps/oce-apps-bridges", () => ({
  navigator: {
    navigate: jest.fn(),
  },
  externalNavigator: {
    open: jest.fn(),
  }
}))

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
    navigator.navigate.mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render properly on Ipad", () => {
    constants.isMobilePhone = false;

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

  it("should call buttons onPress on mobile", () => {
    const props = createTestProps({});
    const { UNSAFE_getAllByType } = render(
      <AccountItem itemData={accountItemData} columns={columns} {...props} />
    );

    const iconButtons = UNSAFE_getAllByType(IconButton);

    // go to Customer Details button
    fireEvent.press(iconButtons[0]);

    expect(props.navigation.push).toHaveBeenCalledWith("AccountInfo", {
      externalLink: "https://clinicaltrials.gov/ct2/results?cond=&term=Account Name&cntry=testAccountCode&state=&city=&dist=&Search=Search"
    });

    // go to Account Info button
    fireEvent.press(iconButtons[1]);

    expect(navigator.navigate).toHaveBeenCalledWith({}, "Account", "123", "present", "view");

    // Log a call button
    fireEvent.press(iconButtons[2]);

    expect(navigator.navigate).toHaveBeenLastCalledWith(
      { parentId: "123" }, "OCE__Call__c", null, "present", "new"
    );
  });

  it("should call buttons onPress on web", () => {
    Platform.OS = 'web';
    const props = createTestProps({});
    const { UNSAFE_getAllByType } = render(
      <AccountItem itemData={accountItemData} columns={columns} {...props} />
    );

    const iconButtons = UNSAFE_getAllByType(IconButton);

    // go to Customer Details button
    fireEvent.press(iconButtons[0]);

    expect(externalNavigator.open).toHaveBeenCalledWith(
      "https://clinicaltrials.gov/ct2/results?cond=&term=Account Name&cntry=testAccountCode&state=&city=&dist=&Search=Search"
    );

    // go to Account Info button
    fireEvent.press(iconButtons[1]);

    expect(navigator.navigate).toHaveBeenCalledWith({}, "Account", "123", "present", "view");

    // Log a call button
    fireEvent.press(iconButtons[2]);

    expect(externalNavigator.open).toHaveBeenLastCalledWith(
      "{EndPoint}&retURL=/lightning/o/OCE__Call__c/new?recordId=123"
    );
  });

  it("should handle failed navigation with screen navigator bridge", () => {
    navigator.navigate.mockRejectedValue('navigation error');
    const props = createTestProps({});
    const { UNSAFE_getAllByType } = render(
      <AccountItem itemData={accountItemData} columns={columns} {...props} />
    );

    const iconButtons = UNSAFE_getAllByType(IconButton);

    // go to Account Info button
    fireEvent.press(iconButtons[1]);

    expect(navigator.navigate).toHaveBeenCalled();

    // Log a call button
    fireEvent.press(iconButtons[2]);

    expect(navigator.navigate).toHaveBeenCalled();
  })
});
