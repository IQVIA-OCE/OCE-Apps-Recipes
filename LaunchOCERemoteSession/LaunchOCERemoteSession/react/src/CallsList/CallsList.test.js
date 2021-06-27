import React from "react";
import renderer, { act } from "react-test-renderer";
import CallsList from "./CallsList";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Autocomplete,
  Select,
  Search,
  Menu,
  IconButton,
} from "apollo-react-native";
import { databaseManager } from "../../bridge/Database/DatabaseManager.native";

jest.mock("react-native-vector-icons/MaterialCommunityIcons");
jest.mock("./../utils/utils.js");
jest.mock("../../bridge/Localization/localization.native");
jest.mock("../../bridge/EnvironmentData/EnvironmentData.native");

const ACCOUNTS_MOCK = [
  {
    Id: "testId",
    Name: "Account Name",
  },
  {
    Id: "testId2",
    Name: "Account Name 2",
  },
];

const CALLS_MOCK = [
  {
    Id: "testCallId",
  },
];

describe("CallsList", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    Icon.loadFont = jest.fn();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should render component", async () => {
    const promise = Promise.resolve();
    let tree;

    databaseManager.fetch = jest
      .fn()
      .mockResolvedValueOnce({ records: CALLS_MOCK })
      .mockResolvedValueOnce({ records: ACCOUNTS_MOCK })
      .mockResolvedValueOnce({ records: CALLS_MOCK })
      .mockResolvedValue({ records: [] });

    act(() => {
      tree = renderer.create(<CallsList />);
    });

    await act(async () => {
      const searchComponent = tree.root.findByType(Search);
      searchComponent.props.onChangeText("testId");
      jest.advanceTimersByTime(500);
    });

    await act(async () => {
      const refreshButton = tree.root.findAllByType(IconButton)[0];
      refreshButton.props.onPress();
    });
    await act(() => promise);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("should render with recordId", async () => {
    const promise = Promise.resolve();
    let tree;

    databaseManager.fetch = jest
      .fn()
      .mockResolvedValueOnce({ records: CALLS_MOCK })
      .mockResolvedValueOnce({ records: ACCOUNTS_MOCK })
      .mockResolvedValueOnce({ records: CALLS_MOCK })
      .mockResolvedValue({ records: [] });

    await act(async () => {
      tree = renderer.create(<CallsList recordId="test" />);
    });
    await act(() => promise);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
