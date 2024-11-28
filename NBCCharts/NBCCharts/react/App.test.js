import React from "react";
import RN from "react-native";
import App from "./App";
import { render } from "@testing-library/react-native";
import * as nbcApi from "./src/api/nbcApi";
import { NBC_COUNT_DATA, NBC_DATA } from "./src/__mocks__/nbcData";

jest.mock("@oce-apps/oce-apps-bridges", () => ({
  environment: {
    territory: () => ({ name: "Territory" })
  },
  sfNetAPI: {
    enablePromises: jest.fn(),
    query: jest.fn()
  }
}));

describe("App", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should render properly", () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValueOnce(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);

    render(<App />);
  });

  it("should render properly in dark mode", () => {
    jest.spyOn(nbcApi, "fetchNbcData").mockResolvedValueOnce(NBC_DATA);
    jest.spyOn(nbcApi, "fetchNbcDataCount").mockResolvedValue(NBC_COUNT_DATA);
    jest.spyOn(RN, 'useColorScheme').mockReturnValueOnce('dark');

    render(<App />);
  });
});
