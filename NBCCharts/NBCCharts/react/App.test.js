import React from "react";
import RN from "react-native";
import App from "./App";
import { render, act } from "@testing-library/react-native";
import * as nbcApi from "./src/api/nbcApi";
import { NBC_COUNT_DATA, NBC_DATA } from "./src/__mocks__/nbcData";

jest.mock("oce-apps-bridges", () => ({
  environment: {
    territory: () => ({ name: "Territory" })
  },
  sfNetAPI: {
    enablePromises: jest.fn(),
    query: jest.fn()
  }
}));

describe("App", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should render properly", () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValueOnce(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    render(<App />);
  });

  it("should render properly in dark mode", async () => {
    const promise = Promise.resolve();
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValueOnce(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    const mock = jest.fn();

    jest.spyOn(RN, 'useColorScheme').mockImplementation(mock);

    mock.mockReturnValueOnce('dark');

    render(<App />);

    await act(() => promise);
  });
});
