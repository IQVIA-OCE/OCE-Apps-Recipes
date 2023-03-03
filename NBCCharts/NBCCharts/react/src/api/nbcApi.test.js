import * as nbcApi from "./nbcApi";
import {
  DEFAULT_QUERY_PARAMS,
  NBC_COUNT_DATA,
  NBC_DATA
} from "../__mocks__/nbcData";
import { sfNetAPI } from "oce-apps-bridges";

jest.mock("oce-apps-bridges", () => ({
  sfNetAPI: {
    query: jest.fn()
  }
}));

describe("fetchNbcData", () => {
  it("without filterQuery argument", () => {
    const spy = jest.spyOn(sfNetAPI, "query").mockResolvedValueOnce(NBC_DATA);

    nbcApi.fetchNbcData(DEFAULT_QUERY_PARAMS);

    expect(spy).toHaveBeenCalled();
  });

  it("with filterQuery argument", () => {
    const spy = jest.spyOn(sfNetAPI, "query").mockResolvedValueOnce(NBC_DATA);

    nbcApi.fetchNbcData({
      ...DEFAULT_QUERY_PARAMS,
      filterQuery: "Filter Query"
    });

    expect(spy).toHaveBeenCalled();
  });

  describe("fetchNbcDataCount", () => {
    it("without filterQuery argument", () => {
      const spy = jest
        .spyOn(sfNetAPI, "query")
        .mockResolvedValueOnce(NBC_COUNT_DATA);

      nbcApi.fetchNbcDataCount({ filterQuery: "", territoryName: "Territory" });

      expect(spy).toHaveBeenCalled();
    });

    it("with filterQuery argument", () => {
      const spy = jest
        .spyOn(sfNetAPI, "query")
        .mockResolvedValueOnce(NBC_COUNT_DATA);

      nbcApi.fetchNbcDataCount({
        filterQuery: "Filter Query",
        territoryName: "Territory"
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  it("fetchNbcHistory", () => {
    const spy = jest
      .spyOn(sfNetAPI, "query")
      .mockResolvedValueOnce(NBC_COUNT_DATA);

    nbcApi.fetchNbcHistory("1");

    expect(spy).toHaveBeenCalled();
  });
});
