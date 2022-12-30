import React from "react";
import renderer, { act } from "react-test-renderer";
import CallItem from "./CallItem";
import { TouchableOpacity } from "react-native";
import { IconButton } from "apollo-react-native";
import { navigator } from "oce-apps-bridges";
import { ListItemType } from "../utils/constants";


describe("CallItem", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    navigator.dispatch = jest.fn().mockResolvedValueOnce("");
    navigator.openDeeplink = jest.fn().mockResolvedValueOnce("");
  });
  it("should render component of call type", async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <CallItem
          item={{
            id: "id",
            dateTime: "",
            endDateTime: "",
            accountName: "accountName",
            location: "location",
            type: ListItemType.Call
          }}
          setErrorBanner={jest.fn()}
        />
      );
    });

    act(() => tree.root.findAllByType(TouchableOpacity)[0].props.onPress());
    act(() => tree.root.findAllByType(IconButton)[0].props.onPress());

    navigator.dispatch = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error message"));
    navigator.openDeeplink = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error message"));

    act(() => tree.root.findAllByType(TouchableOpacity)[0].props.onPress());
    act(() => tree.root.findAllByType(IconButton)[0].props.onPress());

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("should render component of meeting type", async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <CallItem
          item={{
            id: "id",
            dateTime: "",
            endDateTime: "",
            accountName: "accountName",
            location: "location",
            type: ListItemType.Meeting
          }}
          setErrorBanner={jest.fn()}
        />
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
