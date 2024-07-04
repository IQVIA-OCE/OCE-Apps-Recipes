import React from "react";
import AccountsScreen from "./index";
import { render, fireEvent } from "@testing-library/react-native";
import { IconButton, Menu, Search } from "@oce-apps/apollo-react-native";
import { FlatList } from "react-native";
import * as constants from "../../constants";
import * as nbcApi from "../../api/nbcApi";
import { DEFAULT_QUERY_PARAMS, NBC_COUNT_DATA, NBC_DATA } from '../../__mocks__/nbcData';

jest.mock(
  "@oce-apps/oce-apps-bridges/lib/EnvironmentData/EnvironmentData.native",
  () => ({
    environment: {
      territory: () => ({ name: "Territory" })
    }
  })
);

describe("AccountsScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should render properly", () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    const { findByText } = render(<AccountsScreen />);
    jest.runAllTimers()

    expect(findByText("Account Name 1")).toBeTruthy();
  });

  it("should render properly iPad Version", () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
    jest
      .spyOn(nbcApi, "fetchNbcDataCount")
      .mockResolvedValue(NBC_COUNT_DATA);
    constants.isMobilePhone = false;

    const { findByText } = render(<AccountsScreen />);

    jest.runAllTimers()

    expect(findByText("Account Name 1")).toBeTruthy();
  });

  it("should call toggleSortDirection", () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    const { UNSAFE_getAllByType } = render(<AccountsScreen />);

    jest.runAllTimers();

    expect(dataSpy).toHaveBeenCalled();
    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      sortDirection: "asc"
    });

    const toggleSortDirectionButton = UNSAFE_getAllByType(IconButton).find(
      el => el.props.icon === "arrow-down"
    );

    fireEvent.press(toggleSortDirectionButton);
    jest.runAllTimers();

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      sortDirection: "desc"
    });
  });

  it("should call sortBy", () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    jest.runAllTimers()

    const menuItem = UNSAFE_getByType(Menu).children[0].props.children[1].props
      .children;

    fireEvent.press(menuItem);
    jest.runAllTimers();

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

  it("should call searchDebounced", () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    jest.runAllTimers();

    const searchComponent = UNSAFE_getByType(Search);
    fireEvent.changeText(searchComponent, "Search query");

    jest.runAllTimers();

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      filterQuery: "Search query"
    });
  });

  it("should call queryMore", () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType } = render(<AccountsScreen />);

    jest.runAllTimers();

    const flatListComponent = UNSAFE_getByType(FlatList);
    fireEvent(flatListComponent, 'onEndReached');
    jest.runAllTimers();

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      offset: 20
    });
  });

  it("should call queryMore with filterQuery parameter", () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const { UNSAFE_getByType, findByText } = render(<AccountsScreen />);

    jest.runAllTimers()

    fireEvent.changeText(UNSAFE_getByType(Search), "Filter query");
    jest.runAllTimers();

    const flatListComponent = UNSAFE_getByType(FlatList);

    fireEvent(flatListComponent, 'onEndReached');
    jest.runAllTimers();

    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      filterQuery: "Filter query",
      offset: 20
    });
  });

  describe("should handle query errors: ", () => {
    it("data query", () => {
      jest
        .spyOn(nbcApi, "fetchNbcData")
        .mockRejectedValue(new Error("Error"));
      jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
      const { findByText } = render(<AccountsScreen />);

      jest.runAllTimers();

      expect(findByText("Something went wrong")).toBeTruthy();
    });

    it("count query", () => {
      jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
      jest
        .spyOn(nbcApi, "fetchNbcDataCount")
        .mockRejectedValue(new Error("Error"));
      const { findByText } = render(<AccountsScreen />);

      jest.runAllTimers();

      expect(findByText("Something went wrong")).toBeTruthy();
    });
  });

  it("should handle press on list item", () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const navigate = jest.fn();
    const { getByTestId } = render(
      <AccountsScreen navigation={{ navigate }} />
    );

    jest.runAllTimers();

    const listItem = getByTestId("list-item-0");

    fireEvent.press(listItem);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("AccountDetails", {
      nbcAccountData: NBC_DATA.records[0],
      parentScreenTitle: undefined
    });
  });
});
