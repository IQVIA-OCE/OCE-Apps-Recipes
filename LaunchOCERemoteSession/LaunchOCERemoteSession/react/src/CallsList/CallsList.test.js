import React from "react";
import CallsList from "./CallsList";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Search,
  IconButton,
  Menu,
} from "apollo-react-native";
import { databaseManager } from "oce-apps-bridges";
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock("react-native-vector-icons/MaterialCommunityIcons");
jest.mock("./../utils/utils.js");

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

    databaseManager.fetch = jest
      .fn()
      .mockResolvedValueOnce({ records: CALLS_MOCK })
      .mockResolvedValueOnce({ records: ACCOUNTS_MOCK })
      .mockResolvedValueOnce({ records: CALLS_MOCK })
      .mockResolvedValue({ records: [] });

  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should render component", async () => {

    const { container } = await waitFor(() =>
       render(<CallsList />)
   ); 

    const menu = container.findAllByType(Menu);
    expect(menu.length).toBeTruthy();

    const searchComponent = container.findAllByType(Search)[0];
    expect(searchComponent).toBeTruthy();
    
    const refreshButton = container.findAllByType(IconButton)[0];
    expect(refreshButton).toBeTruthy();

    await act(async () => {
      fireEvent.changeText(searchComponent, 'value');
      jest.advanceTimersByTime(500);
    })

    fireEvent.press(refreshButton);

  });

  it("should render with recordId", async () => {

    const { container } = render(<CallsList recordId="test" />);

    const menu = container.findAllByType(Menu);
    expect(menu.length).toEqual(0);

  });
});
