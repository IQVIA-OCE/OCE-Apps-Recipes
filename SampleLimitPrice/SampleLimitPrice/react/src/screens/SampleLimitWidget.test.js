import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import SampleLimitWidget from "./SampleLimitWidget/SampleLimitWidget";
import { render, act } from "@testing-library/react-native";
import { Autocomplete } from "apollo-react-native";
import { databaseManager } from "oce-apps-bridges";
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
import { ACCOUNTS_RESPONSE, PRODUCTS_RESPONSE, ACCOUNT } from '../../__mocks__/data';

describe("SampleLimitWidget", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("SampleLimitWidget should render properly", async () => {
    const productsSpy = jest
      .spyOn(activityPlanApi, "fetchAllActivityPlans")
      .mockResolvedValue(PRODUCTS_RESPONSE.records);
    const accSpy = jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE.records);

    const { findByText } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    expect(findByText(/Will Denzer/i)).toBeTruthy();
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

  it("Should search for a value from Account Search component", async () => {
    jest
      .spyOn(activityPlanApi, "fetchAllActivityPlans")
      .mockResolvedValue(PRODUCTS_RESPONSE.records);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE.records);

    const { UNSAFE_getAllByType } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    act(async () =>
      await UNSAFE_getAllByType(Autocomplete)[1].props.onChange(ACCOUNT)
    );

    await act(() => promise);
    await expect(UNSAFE_getAllByType(Autocomplete)[1].props.singleSelectValue).toStrictEqual(ACCOUNT);
  });

  it("should select one product from dropdown", async () => {
    jest
      .spyOn(activityPlanApi, "fetchAllActivityPlans")
      .mockResolvedValue(PRODUCTS_RESPONSE.records);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE.records);

    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <SampleLimitWidget accountId={"0016s00000OYmXsAAL"} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    await act(() =>
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

    await expect(
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
