import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import SampleLimitWidget from "./SampleLimitWidget/SampleLimitWidget";
import { render, act } from "@testing-library/react-native";
import { Autocomplete } from "apollo-react-native";
import { databaseManager } from "oce-apps-bridges";
import CustomAutoComplete from "../components/CustomAutoComplete";
import * as activityPlanApi from "../api/activityPlanApi";

jest.mock("oce-apps-bridges", () => ({
  environment: {
    namespace: () => "OCE__",
    sfApiVersion: () => "1",
    userID: () => "1",
    profileId: () => "2",
    organizationId: () => "3",
  },
  databaseManager: {
    upsert: jest.fn(),
    fetch: jest.fn(),
    delete: jest.fn(),
  },
}));

import DonutChartContainer from "../components/DonutChartContainer";
import { ACCOUNTS_RESPONSE, PRODUCTS_RESPONSE } from '../../__mocks__/data';

describe("SampleLimitWidget", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("SampleLimitWidget should render properly", async () => {
    const productsSpy = jest
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    const accSpy = jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    const { getByText } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    const defaultProductNameEl = getByText("Will Denzer");
    expect(defaultProductNameEl).toBeTruthy();

    expect(productsSpy).toHaveBeenCalledTimes(1);
    expect(accSpy).toHaveBeenCalled();
  });

  it("SampleLimitWidget should render properly with error in fetching products records", async () => {
    jest.spyOn(databaseManager, "fetch").mockRejectedValue("error");

    const { queryByText } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    const defaultProductNameEl = queryByText("Will Denzer");
    expect(defaultProductNameEl).toBeNull();
  });

  it("Should search for a value from CustomAutoComplete component", async () => {
    jest
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    const { UNSAFE_getByType } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    const customAutocompleteEl = UNSAFE_getByType(CustomAutoComplete);

    act(() => {
      customAutocompleteEl.props.onSelectItem({
        label: "John Doe",
        value: "11111111111111111",
      });
    });

    expect(UNSAFE_getByType(Autocomplete).props.source.length).toBe(0);
  });

  it("Should be able to tap on TouchableWithoutFeedback", async () => {
    jest
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    const { UNSAFE_getByType } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    const customAutocompleteEl = UNSAFE_getByType(CustomAutoComplete);

    expect(customAutocompleteEl.props.isVisible).toBe(false);

    act(() => {
      customAutocompleteEl.props.toggleListActive(true);
    });

    expect(customAutocompleteEl.props.isVisible).toBe(true);

    act(() => {
      UNSAFE_getByType(TouchableWithoutFeedback).props.onPress();
    });

    expect(customAutocompleteEl.props.isVisible).toBe(false);
  });

  it("should select one product from dropdown", async () => {
    jest
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    act(() =>
      UNSAFE_getAllByType(Autocomplete)[0].props.onChange({
        label: "Azelastine100MG",
        value: "0016s00000OWox3AAD",
        details: {
          disbursed: 8,
          hqLimit: 4,
          managerLimit: 4,
          quota: 9,
          remaining: 1,
          repLimit: 5,
        },
      })
    );

    expect(
      UNSAFE_getByType(DonutChartContainer).props.selectedProduct
    ).toStrictEqual({
      label: "Azelastine100MG",
      value: "0016s00000OWox3AAD",
      details: {
        disbursed: 8,
        hqLimit: 4,
        managerLimit: 4,
        quota: 9,
        remaining: 1,
        repLimit: 5,
      },
    });
  });
});
