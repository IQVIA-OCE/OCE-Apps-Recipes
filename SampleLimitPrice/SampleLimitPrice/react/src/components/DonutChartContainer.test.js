import React from "react";
import DonutChartContainer from "./DonutChartContainer";
import { render, act } from "@testing-library/react-native";
import { TouchableOpacity } from "react-native";
import { DonutChart, Menu } from "apollo-react-native";

describe("DonutChartContainer", () => {
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

    const promise = Promise.resolve();

    await act(() => promise);

    const titleEl = getByText("Product A1");

    expect(titleEl).toBeTruthy();

    const chartEl = UNSAFE_getByType(DonutChart);

    expect(chartEl.props.data).toStrictEqual([
      { name: "Disbursed", tooltip: 7, value: 70 },
    ]);

    const menuBtn = UNSAFE_getByType(TouchableOpacity);
    const menuComponent = UNSAFE_getByType(Menu);

    await act(() => {
      menuBtn.props.onPress();
    });

    expect(menuComponent.props.visible).toBe(true);

    await act(() => {
      menuComponent.props.onDismiss();
    });

    expect(menuComponent.props.visible).toBe(false);
  });
});
