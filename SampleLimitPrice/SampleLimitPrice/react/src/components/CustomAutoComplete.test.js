import React from "react";
import CustomAutoComplete from "./CustomAutoComplete";
import { render, act } from "@testing-library/react-native";
import { TouchableOpacity } from "react-native";
import { TextInput, Search } from "apollo-react-native";

const ACCOUNTS = [
  { label: "- / Akhtar", value: "0016s00000OYSujAAH" },
  { label: "- / Akhtar", value: "0016s00000OZjbvAAD" },
  { label: "- / BOWENtest", value: "0016g000006RAjJAAW" },
  { label: "- / BOWENtest", value: "0016g00000LAgpkAAD" },
  { label: "- / BOWENtest", value: "0016g00000LAgDtAAL" },
];

describe("CustomAutoComplete", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("CustomAutoComplete should render properly", () => {
    const { getByPlaceholderText } = render(
      <CustomAutoComplete data={ACCOUNTS} />
    );

    expect(getByPlaceholderText("Search Accounts")).toBeTruthy();
  });

  it("CustomAutoComplete should select one record while user tap on flat list items", async () => {
    const toggleListActive = jest.fn();
    const onSelectItem = jest.fn();
    const searchItemByQuery = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <CustomAutoComplete
        data={ACCOUNTS}
        searchItemByQuery={searchItemByQuery}
        isVisible={true}
        onSelectItem={onSelectItem}
        toggleListActive={toggleListActive}
      />
    );

    act(() => {
      UNSAFE_getAllByType(TouchableOpacity)[2].props.onPress({
        label: "- / Akhtar",
        value: "0016s00000OZjbvAAD",
      });
    });

    const promise = Promise.resolve();

    await act(() => promise);

    expect(onSelectItem).toHaveBeenCalledTimes(1);
    expect(onSelectItem).toHaveBeenCalledWith({
      label: "- / Akhtar",
      value: "0016s00000OZjbvAAD",
    });
  });

  it("CustomAutoComplete should fetch results for search query", async () => {
    const toggleListActive = jest.fn();
    const searchItemByQuery = jest.fn();
    const { UNSAFE_getByType } = render(
      <CustomAutoComplete
        data={ACCOUNTS}
        isVisible={true}
        searchItemByQuery={searchItemByQuery}
        toggleListActive={toggleListActive}
      />
    );
    act(() => {
      const textInputEl = UNSAFE_getByType(TextInput);

      textInputEl.props.onFocus();
      textInputEl.props.onChangeText("Will");
    });

    const promise = Promise.resolve();

    await act(() => promise);

    expect(searchItemByQuery).toHaveBeenCalledTimes(1);
    expect(searchItemByQuery).toHaveBeenCalledWith("Will");
  });

  it("CustomAutoComplete should clear the results when press on clearicon", async () => {
    const toggleListActive = jest.fn();
    const searchItemByQuery = jest.fn();
    const onSelectItem = jest.fn();
    const { UNSAFE_getByType } = render(
      <CustomAutoComplete
        data={ACCOUNTS}
        isVisible={true}
        onSelectItem={onSelectItem}
        searchItemByQuery={searchItemByQuery}
        toggleListActive={toggleListActive}
      />
    );

    act(() => {
      UNSAFE_getByType(Search).props.onIconPress();
    });

    const promise = Promise.resolve();

    await act(() => promise);

    expect(onSelectItem).toHaveBeenCalledTimes(1);
    expect(onSelectItem).toHaveBeenCalledWith("");
  });
});
