import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  Keyboard,
} from "react-native";
import {
  Banner,
  ApolloProgress,
  Title,
  IconButton,
  Menu,
  Search,
} from "apollo-react-native";

import { NAMESPACE } from "../../App";
import {
  fetchAccounts,
  fetchRemoteCallsForToday,
  fetchRemoteMeetingsForToday,
} from "../api/Calls";
import CallItem from "../CallItem/CallItem";
import { localized } from "../../bridge/Localization/localization.native";
import { normalizeCalls, normalizeMeetings } from "./../utils/utils";

const CallsList = ({ recordId }) => {
  const [isLoading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState({
    isVisible: false,
    message: "",
  });
  const [data, setData] = useState(null);
  const [dataSpec, setDataSpec] = useState({
    callsNumber: 0,
    meetingsNumber: 0,
  });

  const [accountsList, setAccountsList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(
    recordId ? recordId : null
  );

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isListLoading, setListLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const timer = useRef(0);

  useEffect(() => {
    getData(selectedAccount);
  }, [selectedAccount]);

  useEffect(() => {
    setLoading(false);

    if (errorBanner.isVisible) {
      setTimeout(
        () => setErrorBanner({ ...errorBanner, isVisible: false }),
        4000
      );
    }
  }, [errorBanner.isVisible]);

  const getData = async (accountId) => {
    try {
      setLoading(true);
      const callsData = await fetchRemoteCallsForToday(accountId);
      const meetingsData = await fetchRemoteMeetingsForToday();

      const callsNumber = callsData.totalSize;
      const meetingsNumber = meetingsData.totalSize;

      const mappedCallsData = normalizeCalls(callsData.records);
      const mappedMeetingsData = normalizeMeetings(meetingsData.records);

      const mappedData = [...mappedCallsData, ...mappedMeetingsData].sort(
        (a, b) => {
          return (
            a.startDateTimeFull.toMillis() > b.startDateTimeFull.toMillis()
          );
        }
      );
      setDataSpec({ callsNumber, meetingsNumber });
      setData([...mappedData]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorBanner({
        isVisible: true,
        message: err,
      });
    }
  };

  const fetchAccountsList = (value) => {
    setSearchValue(value);
    try {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      let accounts;
      if (value.trim()) {
        timer.current = setTimeout(async () => {
          setListLoading(true);
          accounts = await fetchAccounts(value);
          const mappedAccounts = accounts.records.map((el) => {
            return {
              label: `${el.Name}`,
              value: el.Id,
            };
          });
          setAccountsList(mappedAccounts);
          setListLoading(false);
        }, 400);
      }
    } catch (e) {
      console.warn({ e });
    }
  };

  const filterItemsById = (id) => {
    const filteredData = data.filter((listItem) => listItem.id != id);
    setData([...filteredData]);
  };

  return (
    <View>
      <View style={styles.title}>
        <View style={{ flexDirection: "row" }}>
          <Title style={{ fontSize: 15 }}>
            {localized(`${NAMESPACE}scheduled_calls`, "Scheduled Calls")}
          </Title>
          <IconButton
            icon="refresh"
            size={18}
            color={"#297dfd"}
            onPress={() => {
              getData(selectedAccount);
            }}
            style={{marginTop: 3}}
          />
        </View>
        <View style={{marginTop: -5}}>
          <Text style={styles.additionalTitleInfo}>
            {localized(`${NAMESPACE}calls`, "Calls")}: {dataSpec.callsNumber},{" "}
            {localized(`${NAMESPACE}event_meeting`, "Meeting")}: {dataSpec.meetingsNumber}
          </Text>
        </View>
      </View>
      <Banner
        closeIcon
        visible={errorBanner.isVisible}
        variant={"warning"}
        icon={"alert"}
      >
        {errorBanner.message.message}
      </Banner>
      {isLoading && (
        <View style={styles.preloader}>
          <ApolloProgress />
        </View>
      )}

      <View style={{ flexDirection: "row" }}>
        {recordId ? null : (
          <Menu
            visible={isMenuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <View>
                <Search
                  placeholder={localized(
                    `${NAMESPACE}account_name`,
                    "Account Name"
                  )}
                  onFocus={() => setMenuVisible(true)}
                  onChangeText={fetchAccountsList}
                  onIconPress={() => {
                    setSelectedAccount(null);
                    setSearchValue("");
                  }}
                  value={searchValue}
                  style={{ width: 310 }}
                />
              </View>
            }
          >
            {isListLoading && (
              <View style={styles.listLoader}>
                <ApolloProgress />
              </View>
            )}
            {accountsList.length === 0 && (
              <Text style={{ textAlign: "center", paddingVertical: 20 }}>
                No accounts found
              </Text>
            )}
            <ScrollView
              style={{ maxHeight: 300, width: 300 }}
              keyboardShouldPersistTaps="always"
            >
              {accountsList.map((el) => {
                return (
                  <Menu.Item
                    key={el.value}
                    onPress={() => {
                      setSelectedAccount(el.value);
                      setSearchValue(el.label);
                      setMenuVisible(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text>{el.label}</Text>
                  </Menu.Item>
                );
              })}
            </ScrollView>
          </Menu>
        )}
      </View>

      <View style={styles.callsList}>
        <FlatList
          data={data}
          refreshing={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CallItem
              item={item}
              setErrorBanner={setErrorBanner}
              filterItemsById={filterItemsById}
            />
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                alignSelf: "center",
                paddingTop: 100,
                height: 100 + "%",
                alignItems: "center",
              }}
            >
              <Text>
                {localized(
                  `${NAMESPACE}no_upcoming_scheduled_calls`,
                  "No Upcoming Scheduled Calls"
                )}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  preloader: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  callsList: {
    height: 320,
    flexGrow: 0,
  },
  searchRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 400,
  },
  search: {
    width: 265,
    marginLeft: "auto",
    marginRight: "auto",
  },
  listLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 2,
  },
  additionalTitleInfo: {
    fontSize: 12,
    color: "#666",
    fontStyle: 'italic'
  },
});

export default CallsList;
