import { databaseManager } from "oce-apps-bridges";
import { fetchRemoteCallsForToday, fetchRemoteMeetingsForToday, fetchAccounts } from "./Calls";

describe("Call", () => {
  it("fetchRemoteCallsForToday", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchRemoteCallsForToday();
    expect(spy).toHaveBeenCalled();
  });
  it("fetchRemoteCallsForToday with accountId", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchRemoteCallsForToday('accountId');
    expect(spy).toHaveBeenCalled();
  });
  it("fetchRemoteMeetingsForToday", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchRemoteMeetingsForToday();
    expect(spy).toHaveBeenCalled();
  });
  it("fetchAccounts", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchAccounts();
    expect(spy).toHaveBeenCalled();
  });
});
