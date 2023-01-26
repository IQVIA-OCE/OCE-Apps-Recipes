import * as React from "react";
import AccountInfoScreen from "./index";
import { render, act } from "@testing-library/react-native";
import { WebView } from "react-native-webview";
import { IconButton } from "apollo-react-native";

const NAVIGATION_MOCK = {
  state: { params: { accountName: "Test", countryCode: "US" } }
};

describe("AccountInfoScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render properly", () => {
    const { UNSAFE_getByType } = render(
      <AccountInfoScreen navigation={NAVIGATION_MOCK} />
    );

    const webViewEl = UNSAFE_getByType(WebView);

    expect(webViewEl).toBeTruthy();
    expect(webViewEl.props.source).toStrictEqual({
      uri:
        "https://clinicaltrials.gov/ct2/results?cond=&term=Test&cntry=US&state=&city=&dist=&Search=Search"
    });
  });

  it("should call onNavigationStateChange", () => {
    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <AccountInfoScreen navigation={NAVIGATION_MOCK} />
    );

    const webview = UNSAFE_getByType(WebView);

    act(() => {
      webview.props.onNavigationStateChange({
        canGoForward: true,
        canGoBack: true
      });
    });

    const iconButtons = UNSAFE_getAllByType(IconButton);

    // back button
    expect(iconButtons[0].props.disabled).toBe(false);
    // forward button
    expect(iconButtons[1].props.disabled).toBe(false);
  });
});
