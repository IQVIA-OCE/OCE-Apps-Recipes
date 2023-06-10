import { act, render, waitFor } from "@testing-library/react-native";
import { DonutChart, Menu } from "apollo-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import DonutChartContainer from "./DonutChartContainer";


describe("DonutChartContainer", () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("DonutChartContainer should render properly without data", () => {
    const { UNSAFE_getByType } = render(<DonutChartContainer />);

    const chartEl = UNSAFE_getByType(DonutChart);

    expect(chartEl.props.data).toStrictEqual([
      { name: "Disbursed", tooltip: 0, value: 0 },
    ]);
  });

  it("DonutChartContainer should render properly with data", async () => {
    const selectedProduct = {
      label: "Product A1",
      details: {
        disbursed: 7,
        hqLimit: 4,
        managerLimit: 4,
        quota: 10,
        remaining: 3,
        repLimit: 10,
        minCallLimit: 1,
        maxCallLimit: 20,
      },
    };
    const { UNSAFE_getByType, getByText } = render(
      <DonutChartContainer selectedProduct={selectedProduct} />
    );

    await waitFor(() => {
      expect(getByText("Product A1")).toBeTruthy();
      expect(UNSAFE_getByType(DonutChart).props.data).toStrictEqual([
        { name: "Disbursed", tooltip: 7, value: 70 },
      ]);
    });

    act(() => {
      const menuBtn = UNSAFE_getByType(TouchableOpacity);
      menuBtn.props.onLayout({
        nativeEvent: {
          layout: {
            width: 40,
            height: 40,
          },
        },
      });
      menuBtn.props.onPress();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(Menu).props.visible).toBe(true);
    });

    act(() => {
      UNSAFE_getByType(Menu).props.onDismiss();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(Menu).props.visible).toBe(false);
    });
  });
});
