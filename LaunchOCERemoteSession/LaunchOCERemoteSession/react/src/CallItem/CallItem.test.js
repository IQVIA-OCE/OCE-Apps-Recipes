import React from "react";
import CallItem from "./CallItem";
import { TouchableOpacity } from "react-native";
import { IconButton, Text } from "apollo-react-native";
import { navigator } from "oce-apps-bridges";
import { ListItemType } from "../utils/constants";
import { fireEvent, render } from '@testing-library/react-native';

describe("CallItem", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    navigator.navigate = jest.fn().mockResolvedValueOnce("");
    navigator.openDeeplink = jest.fn().mockResolvedValueOnce("");
  });
  it("should render component of call type", async () => {

    const { container } = render(<CallItem
      item={{
        id: "id",
        dateTime: "",
        endDateTime: "",
        accountName: "accountName",
        location: "location",
        type: ListItemType.Call
      }}
      setErrorBanner={jest.fn()}
    />);

    const touchableOpacity = container.findAllByType(TouchableOpacity)[0];
    const iconButton = container.findAllByType(IconButton)[0];

    fireEvent.press(touchableOpacity);
    fireEvent.press(iconButton);
    expect(navigator.navigate).toHaveBeenCalled();

    navigator.navigate = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error message"));
    navigator.openDeeplink = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error message"));

    expect(container.findAllByType(Text).length).toEqual(4);
    expect(touchableOpacity).toBeTruthy();
    expect(iconButton).toBeTruthy();
  });

  it("should render component of meeting type", async () => {
    const { container } = render(<CallItem
      item={{
        id: "id",
        dateTime: "",
        endDateTime: "",
        accountName: "accountName",
        location: "location",
        type: ListItemType.Call
      }}
      setErrorBanner={jest.fn()}
    />);

    const touchableOpacity = container.findAllByType(TouchableOpacity)[0];
    const iconButton = container.findAllByType(IconButton)[0];

    expect(container.findAllByType(Text).length).toEqual(4);
    expect(touchableOpacity).toBeTruthy();
    expect(iconButton).toBeTruthy();
  });
});
