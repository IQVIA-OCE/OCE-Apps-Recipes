import { normalizeCalls, normalizeMeetings } from "./utils";
import { environment } from "./../../bridge/EnvironmentData/EnvironmentData.native";
import { ListItemType } from "./constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DateTime } from "luxon";

jest.mock("./../../bridge/EnvironmentData/EnvironmentData.native");
jest.mock("./../../App.js", () => ({
  get NAMESPACE() {
    return "";
  },
}));
jest.mock("react-native-vector-icons/MaterialCommunityIcons");

describe("normalizer", () => {
  beforeAll(() => {
    environment.timeZone = jest.fn().mockReturnValue("utc");
    environment.namespace = jest.fn().mockReturnValue("");
    Icon.loadFont = jest.fn();
  });

  it("should return normalized calls", () => {
    const normalizedCalls = normalizeCalls([
      {
        Id: "Id",
        Name: "Name",
        Duration__c: "15",
        Account__c: "Account__c",
        CallDateTime__c: "2020-12-31",
        EndCallDateTime__c: "2020-12-31",
        "Account__r.Name": "Name",
        LocationName__c: "LocationName__c",
      },
    ]);

    expect(normalizedCalls).toStrictEqual([
      {
        id: "Id",
        name: "Name",
        duration: "15",
        accountId: "Account__c",
        accountName: "Name",
        dateTime: "12:00 AM",
        endDateTime: "12:00 AM",
        endDateTimeFull: DateTime.fromISO("2020-12-31", {
          zone: "utc",
        }),
        startDateTimeFull: DateTime.fromISO("2020-12-31", {
          zone: "utc",
        }),
        location: "LocationName__c",
        type: ListItemType.Call,
      },
    ]);
  });
  it("should return normalized meetings", () => {
    const normalizedMeetings = normalizeMeetings([
      {
        Id: "Id",
        Name: "Name",
        StartDateTime__c: "2020-12-31",
        EndDateTime__c: "2020-12-31",
        Location__c: "LocationName__c",
      },
    ]);

    expect(normalizedMeetings).toStrictEqual([
      {
        id: "Id",
        name: "Name",
        dateTime: "12:00 AM",
        endDateTime: "12:00 AM",
        endDateTimeFull: DateTime.fromISO("2020-12-31", {
          zone: "utc",
        }),
        startDateTimeFull: DateTime.fromISO("2020-12-31", {
          zone: "utc",
        }),
        location: "LocationName__c",
        type: ListItemType.Meeting,
        accountName: "Name",
      },
    ]);
  });
});
