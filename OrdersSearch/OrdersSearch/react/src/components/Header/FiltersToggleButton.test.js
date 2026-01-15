import { render } from "@testing-library/react-native";
import React from "react";
import { FiltersToggleButton } from "./FiltersToggleButton";
import ReactNative from "react-native";
import {
  Provider as ApolloProvider,
  DarkTheme,
} from "@oce-apps/apollo-react-native";

describe("FiltersToggleButton", () => {
  it("should render FiltersToggleButton expanded", () => {
    let { UNSAFE_getByProps } = render(
      <FiltersToggleButton title={"title"} expanded={true} filterCount={1} />
    );
    const accordionIcon = UNSAFE_getByProps({ name: "chevron-right" });
    expect(accordionIcon).toBeTruthy();
  });
  it("should render FiltersToggleButton collapsed", () => {
    let { UNSAFE_getByProps } = render(
      <FiltersToggleButton title={"title"} expanded={false} filterCount={1} />
    );
    const accordionIcon = UNSAFE_getByProps({ name: "chevron-down" });
    expect(accordionIcon).toBeTruthy();
  });

  it("should render FiltersToggleButton dark theme", () => {
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");
    let { UNSAFE_getByProps } = render(
      <ApolloProvider theme={DarkTheme}>
        <FiltersToggleButton title={"title"} expanded={false} filterCount={1} />
      </ApolloProvider>
    );
    const accordionIcon = UNSAFE_getByProps({ name: "chevron-down" });
    expect(accordionIcon.props.color).toEqual(DarkTheme.colors.primary);
  });
});
