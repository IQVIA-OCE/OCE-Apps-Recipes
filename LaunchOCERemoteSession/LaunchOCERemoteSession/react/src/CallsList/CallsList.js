import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import {
  Banner,
  Portal,
  ApolloProgress,
  Title,
  IconButton,
  Menu,
  Search,
  Text,
  useTheme,
  Card,
} from '@oce-apps/apollo-react-native';
import color from 'color';

import { NAMESPACE } from "../../App";
import {
  fetchAccounts,
  fetchRemoteCallsForToday,
  fetchRemoteMeetingsForToday,
} from "../api/Calls";
import CallItem from "../CallItem/CallItem";
import { localized } from "@oce-apps/oce-apps-bridges";
import { normalizeCalls, normalizeMeetings } from "../utils/utils";

const CallsList = ({ recordId }) => {
  const theme = useTheme();
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
    let callsData;
    let callsNumber = 0;
    let mappedCallsData = [];

    let meetingsData;
    let meetingsNumber = 0;
    let mappedMeetingsData = [];

    setLoading(true);

    try {
      callsData = await fetchRemoteCallsForToday(accountId);
      callsNumber = callsData.totalSize;
      mappedCallsData = normalizeCalls(callsData.records);
    } catch (err) {
      setErrorBanner({
        isVisible: true,
        message: err,
      });
    }

    try {
      meetingsData = await fetchRemoteMeetingsForToday();
      meetingsNumber = meetingsData.totalSize;
      mappedMeetingsData = normalizeMeetings(meetingsData.records);
    } catch (err) {
      setErrorBanner({
        isVisible: true,
        message: err,
      });
    }

    const mappedData = [...mappedCallsData, ...mappedMeetingsData].sort(
      (a, b) => {
        return a.startDateTimeFull.toMillis() > b.startDateTimeFull.toMillis();
      }
    );

    setDataSpec({ callsNumber, meetingsNumber });
    setData([...mappedData]);
    setLoading(false);
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
          if (!isMenuVisible) {
            setMenuVisible(true);
          }
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
    <Card>
      <Portal>
        <Banner
          closeIcon
          visible={errorBanner.isVisible}
          variant={"warning"}
          icon={"alert"}
        >
          {errorBanner.message.message}
        </Banner>
      </Portal>
      <View style={styles.title}>
        <View style={{ flexDirection: "row", alignItems: 'center', paddingTop: Platform.OS === 'web' ? 10 : 0 }}>
          <Title style={{ fontSize: 15 }}>
            {localized(`${NAMESPACE}scheduled_calls`, "Scheduled Calls")}
          </Title>
          <IconButton
            icon="refresh"
            size={18}
            color={theme.colors.primary}
            onPress={() => {
              getData(selectedAccount);
            }}
          />
        </View>
        <View style={{ marginTop: -5 }}>
          <Text style={[styles.additionalTitleInfo, { color: theme.colors.tertiary }]}>
            {localized(`${NAMESPACE}calls`, "Calls")}: {dataSpec.callsNumber},{" "}
            {localized(`${NAMESPACE}event_meeting`, "Meeting")}:{" "}
            {dataSpec.meetingsNumber}
          </Text>
        </View>
      </View>

      {isLoading && (
        <View style={[styles.preloader, { backgroundColor: color(theme.colors.surface).alpha(0.8).string() }]}>
          <ApolloProgress />
        </View>
      )}

      <View style={{ flexDirection: "row", paddingLeft: 10 }}>
        {recordId ? null : (
          <Menu
            contentStyle={{ maxHeight: 300, width: 300 }}
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
                  onChangeText={(val) => {
                    if (searchValue !== val) {
                      fetchAccountsList(val);
                    }
                  }}
                  onIconPress={() => {
                    setAccountsList([]);
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
              <View style={[styles.listLoader, { backgroundColor: color(theme.colors.surface).alpha(0.8).string() }]}>
                <ApolloProgress />
              </View>
            )}
            {accountsList.length === 0 && (
              <Text style={{ textAlign: "center", paddingVertical: 20 }}>
                No accounts found
              </Text>
            )}
            <ScrollView
              keyboardShouldPersistTaps="always"
            >
              {accountsList.map((el) => {
                return (
                  <Menu.Item
                    key={el.value}
                    onPress={() => {
                      setAccountsList([{ ...el }]);
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
    </Card>
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
    zIndex: 2,
  },
  additionalTitleInfo: {
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default CallsList;
