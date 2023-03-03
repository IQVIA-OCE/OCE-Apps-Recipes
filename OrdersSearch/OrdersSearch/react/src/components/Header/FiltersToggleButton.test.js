import { render } from "@testing-library/react-native";
import React from "react";
import { FiltersToggleButton } from "./FiltersToggleButton";
import ReactNative from "react-native";
import {
  Provider as ApolloProvider,
  DarkTheme,
} from "apollo-react-native";

describe("FiltersToggleButton", () => {
  it("should render FiltersToggleButton expanded", () => {
    let { container } = render(
      <FiltersToggleButton title={"title"} expanded={true} filterCount={1} />
    );
    const accordionIcon = container.findByProps({ testID: "accordionIcon" });
    expect(accordionIcon._fiber.pendingProps.name).toEqual("chevron-right");
  });
  it("should render FiltersToggleButton collapsed", () => {
    let { container } = render(
      <FiltersToggleButton title={"title"} expanded={false} filterCount={1} />
    );
    const accordionIcon = container.findByProps({ testID: "accordionIcon" });
    expect(accordionIcon._fiber.pendingProps.name).toEqual("chevron-down");
  });

  it("should render FiltersToggleButton dark theme", () => {
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");
    let { container } = render(
      <ApolloProvider theme={DarkTheme}>
        <FiltersToggleButton title={"title"} expanded={false} filterCount={1} />
      </ApolloProvider>
    );
    const accordionIcon = container.findByProps({ testID: "accordionIcon" });
    expect(accordionIcon._fiber.pendingProps.color).toEqual(DarkTheme.colors.primary);
  });
});
