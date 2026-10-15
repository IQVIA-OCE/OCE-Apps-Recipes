import { Appbar as ApolloAppBar } from "@oce-apps/apollo-react-native";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import AppBar from "./AppBar";
import { useNavigationState, useRoute } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
  useNavigationState: jest.fn(),
}));

const createTestProps = (props) => ({
  ...props,
  options: {
    headerTitle: "Accounts",
  },
});

describe("AppBar", () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ key: "Accounts" });
  });

  it("Should render AppBar component", () => {
    useNavigationState.mockReturnValueOnce(false);
    const props = createTestProps({ testID: "AppBarComponent" });
    render(<AppBar {...props} />);

    expect(screen.getByTestId("AppBarComponent")).toBeTruthy();
  });

  it("Should render AppBar component with isFirstRouteInParent", () => {
    useNavigationState.mockReturnValueOnce(true);
    const props = createTestProps({ testID: "AppBarComponent" });
    render(<AppBar {...props} />);

    expect(screen.getByTestId("AppBarComponent")).toBeTruthy();
  });

  it("Should render AppBar component with goBack action", () => {
    useNavigationState.mockReturnValueOnce(false);
    const goBack = jest.fn();
    const props = createTestProps({
      navigation: {
        goBack,
      },
    });

    render(<AppBar {...props} />);

    fireEvent.press(screen.UNSAFE_getAllByType(ApolloAppBar.Action)[0]);

    expect(goBack).toHaveBeenCalled();
  });
});
