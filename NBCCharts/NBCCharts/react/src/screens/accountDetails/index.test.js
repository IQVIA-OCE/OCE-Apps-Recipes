import React from "react";
import AccountDetailsScreen from "./index";
import { render, act } from "@testing-library/react-native";
import * as mocks from "../../__mocks__/mocks";
import * as constants from "../../constants";
import * as nbcApi from "../../api/nbcApi";
import { NBC_HISTORY_DATA } from "../../__mocks__/nbcData";
import { DonutChart, LineChart } from "apollo-react-native";

jest.useFakeTimers();

const createTestProps = (props) => ({
  route: {
    params: {
      nbcAccountData: mocks.NBCAccountData,
    },
  },
  ...props,
});

const NBC_SCORE_CHART_DATA = [
  { name: "isTarget  ", value: 50 },
  { name: "recentlyCalled  - DATA_NOT_AVAILABLE", value: 0 },
];

const NBC_SCORE_HISTORY_CHART_DATA = [
  { x: new Date("2022-08-28T07:06:57.000"), y: 50 },
  { x: new Date("2022-08-29T07:06:57.000"), y: 42 },
];

describe("AccountDetailsScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should render properly", async () => {
    jest
      .spyOn(nbcApi, "fetchNbcHistory")
      .mockResolvedValueOnce(NBC_HISTORY_DATA);
    const props = createTestProps({});
    const { getByText, UNSAFE_getByType } = render(
      <AccountDetailsScreen {...props} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    act(() => {
      jest.runAllTimers();
    });

    const accountNameEl = getByText("Abdullah Behroz");
    const accountSpecialtyEl = getByText("Cardiovascular diseases");
    const parentAccountNameEl = getByText("Dr. Behroz");
    const nbcScoreChartEl = UNSAFE_getByType(DonutChart);
    const nbcScoreHistoryChartEl = UNSAFE_getByType(LineChart);

    expect(accountNameEl).toBeTruthy();
    expect(accountSpecialtyEl).toBeTruthy();
    expect(parentAccountNameEl).toBeTruthy();
    expect(nbcScoreChartEl).toBeTruthy();
    expect(nbcScoreChartEl.props.data).toStrictEqual(
      NBC_SCORE_CHART_DATA.map((x) => ({ ...x, tooltip: String(x.value) }))
    );

    expect(nbcScoreHistoryChartEl).toBeTruthy();
    expect(nbcScoreHistoryChartEl.props.data).toStrictEqual({
      data: NBC_SCORE_HISTORY_CHART_DATA.map((x) => ({ ...x, tooltip: x.y })),
    });
  });

  it("should render properly iPad version", async () => {
    constants.isIphone = false;

    jest
      .spyOn(nbcApi, "fetchNbcHistory")
      .mockResolvedValueOnce(NBC_HISTORY_DATA);
    const props = createTestProps({});
    const { getByText, UNSAFE_getByType } = render(
      <AccountDetailsScreen {...props} />
    );

    const promise = Promise.resolve();

    await act(() => promise);

    act(() => {
      jest.runAllTimers();
    });

    const accountNameEl = getByText("Abdullah Behroz");
    const accountSpecialtyEl = getByText("Cardiovascular diseases");
    const parentAccountNameEl = getByText("Dr. Behroz");
    const nbcScoreChartEl = UNSAFE_getByType(DonutChart);
    const nbcScoreHistoryChartEl = UNSAFE_getByType(LineChart);

    expect(accountNameEl).toBeTruthy();
    expect(accountSpecialtyEl).toBeTruthy();
    expect(parentAccountNameEl).toBeTruthy();
    expect(nbcScoreChartEl).toBeTruthy();
    expect(nbcScoreChartEl.props.data).toStrictEqual(
      NBC_SCORE_CHART_DATA.map((x) => ({ ...x, tooltip: String(x.value) }))
    );

    expect(nbcScoreHistoryChartEl).toBeTruthy();
    expect(nbcScoreHistoryChartEl.props.data).toStrictEqual({
      data: NBC_SCORE_HISTORY_CHART_DATA.map((x) => ({ ...x, tooltip: x.y })),
    });
  });
});
