import React from "react";
import AccountsScreen from "./index";
import { render, act, fireEvent } from "@testing-library/react-native";
import { IconButton, Menu, Search } from "apollo-react-native";
import { FlatList } from "react-native";
import * as constants from "../../constants";
import * as nbcApi from "../../api/nbcApi";
import { DEFAULT_QUERY_PARAMS, NBC_COUNT_DATA, NBC_DATA } from '../../__mocks__/nbcData';

jest.mock(
  "oce-apps-bridges/lib/EnvironmentData/EnvironmentData.native",
  () => ({
    environment: {
      territory: () => ({ name: "Territory" })
    }
  })
);


describe("AccountsScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should render properly", async () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValueOnce(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    const { findByText } = render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);

    expect(await findByText("Account Name 1")).toBeTruthy();
  });

  it("should render properly iPad Version", async () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValueOnce(NBC_DATA);
    jest
      .spyOn(nbcApi, "fetchNbcDataCount")
      .mockResolvedValueOnce(NBC_COUNT_DATA);
    constants.isMobilePhone = false;

    const { findByText } = render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);

    expect(await findByText("Account Name 1")).toBeTruthy();
  });

  it("should call toggleSortDirection", async () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    const { UNSAFE_getAllByType } = render(<AccountsScreen />);
    const promise = Promise.resolve();

    await act(() => promise);

    expect(dataSpy).toHaveBeenCalledTimes(1);
    expect(dataSpy).toHaveBeenCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      sortDirection: "asc"
    });

    const toggleSortDirectionButton = UNSAFE_getAllByType(IconButton).find(
      el => el.props.icon === "arrow-down"
    );

    act(() => {
      toggleSortDirectionButton.props.onPress();
    });

    await act(() => promise);

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      sortDirection: "desc"
    });
  });

  it("should call sortBy", async () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);

    const menuItem = UNSAFE_getByType(Menu).children[0].props.children[1].props
      .children;

    act(() => {
      menuItem.props.onPress();
    });

    await act(() => promise);

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      sortColumn: {
        accessor: "OCE__Rank__c",
        id: "Rank",
        isSortable: true,
        title: "Rank",
        type: "number"
      }
    });
  });

  it("should call searchDebounced", async () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);

    const searchComponent = UNSAFE_getByType(Search);

    act(() => {
      searchComponent.props.onChangeText("Search query");
    });

    act(() => {
      jest.runAllTimers();
    });

    await act(() => promise);

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      filterQuery: "Search query"
    });
  });

  it("should call queryMore", async () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);

    const flatListComponent = UNSAFE_getByType(FlatList);

    act(() => {
      flatListComponent.props.onEndReached();
    });

    await act(() => promise);

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      offset: 20
    });
  });

  it("should call queryMore with filterQuery parameter", async () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    const promise = Promise.resolve();
    await act(() => promise);

    UNSAFE_getByType(Search).props.onChangeText("Filter query");
    const flatListComponent = UNSAFE_getByType(FlatList);

    act(() => {
      flatListComponent.props.onEndReached();
    });

    await act(() => promise);

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      filterQuery: "Filter query",
      offset: 20
    });
  });

  describe("should handle query errors: ", () => {
    it("data query", async () => {
      jest
        .spyOn(nbcApi, "fetchNbcData")
        .mockRejectedValueOnce(new Error("Error"));
      jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
      const { getByText } = render(<AccountsScreen />);

      const promise = Promise.resolve();
      await act(() => promise);

      expect(getByText("Something went wrong")).toBeTruthy();
    });

    it("count query", async () => {
      jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
      jest
        .spyOn(nbcApi, "fetchNbcDataCount")
        .mockRejectedValueOnce(new Error("Error"));
      const { getByText } = render(<AccountsScreen />);

      const promise = Promise.resolve();
      await act(() => promise);

      expect(getByText("Something went wrong")).toBeTruthy();
    });
  });

  it("should handle press on list item", async () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const navigate = jest.fn();
    const { getByTestId } = render(
      <AccountsScreen navigation={{ navigate }} />
    );

    const promise = Promise.resolve();
    await act(() => promise);

    const listItem = getByTestId("list-item-0");

    fireEvent.press(listItem);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("AccountDetails", {
      nbcAccountData: NBC_DATA.records[0],
      parentScreenTitle: undefined
    });
  });
});
