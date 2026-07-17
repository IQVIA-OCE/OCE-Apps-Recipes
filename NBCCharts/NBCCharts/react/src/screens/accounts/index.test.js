import React from "react";
import AccountsScreen from "./index";
import {render, fireEvent, act, waitFor} from "@testing-library/react-native";
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

  it("should render properly", async () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    const { findByText } = render(<AccountsScreen />);
    await act( async () => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      expect(findByText("Account Name 1")).toBeTruthy();
    });

  });

  it("should render properly iPad Version", async () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
    jest
      .spyOn(nbcApi, "fetchNbcDataCount")
      .mockResolvedValue(NBC_COUNT_DATA);
    constants.isMobilePhone = false;

    const { findByText } = render(<AccountsScreen />);

    await act( async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(findByText("Account Name 1")).toBeTruthy();
    });
  });

  it("should call toggleSortDirection", () => {
    const dataSpy = jest
      .spyOn(nbcApi, "fetchNbcData")
      .mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    const { UNSAFE_getAllByType } = render(<AccountsScreen />);

    act(() => {
      jest.runAllTimers();
    });

    expect(dataSpy).toHaveBeenCalled();
    expect(dataSpy).toHaveBeenLastCalledWith({
      ...DEFAULT_QUERY_PARAMS,
      sortDirection: "asc"
    });

    const toggleSortDirectionButton = UNSAFE_getAllByType(IconButton).find(
      el => el.props.icon === "arrow-down"
    );

    fireEvent.press(toggleSortDirectionButton);
    act(() => {
      jest.runAllTimers();
    });

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

    act(() => {
      jest.runAllTimers();
    });

    const menuItem = UNSAFE_getByType(Menu).children[0].props.children[1].props
      .children;

    fireEvent.press(menuItem);
    act(() => {
      jest.runAllTimers();
    });

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

    act(() => {
      jest.runAllTimers();
    });

    const searchComponent = UNSAFE_getByType(Search);
    fireEvent.changeText(searchComponent, "Search query");

    await act(async () => {
      jest.runAllTimers();
    });

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

    await act(async () => {
      jest.runAllTimers();
    });

    const flatListComponent = UNSAFE_getByType(FlatList);
    await fireEvent(flatListComponent, 'onEndReached');
    await act(async () => {
      jest.runAllTimers();
    });

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

    await act(async () => {
      jest.runAllTimers();
    });

    await fireEvent.changeText(UNSAFE_getByType(Search), "Filter query");
    await act(async () => {
      jest.runAllTimers();
    });

    const flatListComponent = UNSAFE_getByType(FlatList);

    await fireEvent(flatListComponent, 'onEndReached');
    await act(async () => {
      jest.runAllTimers();
    });

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
        .mockRejectedValue(new Error("Error"));
      jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
      const { findByText } = render(<AccountsScreen />);

      await act(async () => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(findByText("Something went wrong")).toBeTruthy();
      });
    });

    it("count query", async () => {
      jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
      jest
        .spyOn(nbcApi, "fetchNbcDataCount")
        .mockRejectedValue(new Error("Error"));
      const { findByText } = render(<AccountsScreen />);

      await act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(findByText("Something went wrong")).toBeTruthy();
      })
    });
  });

  it("should handle press on list item", async () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValue(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    const navigate = jest.fn();
    const { getByTestId } = render(
      <AccountsScreen navigation={{ navigate }} />
    );

    await act( async () => {
      jest.runAllTimers();
    });

    const listItem = getByTestId("list-item-0");

    await fireEvent.press(listItem);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("AccountDetails", {
      nbcAccountData: NBC_DATA.records[0],
      parentScreenTitle: undefined
    });
  });
});
