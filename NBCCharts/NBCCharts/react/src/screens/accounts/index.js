import React, { Fragment } from "react";
import { FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  environment
} from "@oce-apps/oce-apps-bridges";

import {
  ActivityIndicator,
  IconButton,
  Menu,
  Search,
  Text,
  withTheme
} from "@oce-apps/apollo-react-native";
import AccountItem from "./accountsList/AccountItem";

import {
  columns,
  defaultSortingColumns,
  extraSortingColumns
} from "./constants/columns";
import { debounce } from "throttle-debounce";
import { isMobilePhone } from "../../constants";
import { fetchNbcData, fetchNbcDataCount } from '../../api/nbcApi';

class AccountsScreen extends React.Component {
  static title = "Accounts";
  static _listView;
  waitingForQuery = "";

  static navigationOptions = {
    title: this.title
  };

  territory = environment.territory();

  openSortOptions = event => {
    const { nativeEvent } = event;

    this.setState(
      {
        sortOptionsMenuCoord: {
          x: nativeEvent.pageX,
          y: nativeEvent.pageY - 30
        }
      },
      () => this.setState({ sortOptionsVisible: true })
    );
  };
  closeSortOptions = () => this.setState({ sortOptionsVisible: false });

  constructor(props) {
    super(props);
    const filteredColumns = columns.filter(col => col.id !== "NextBestTime");

    const sortingColumns = [
      ...filteredColumns,
      ...defaultSortingColumns,
      ...extraSortingColumns
    ].filter(
      (thing, index, self) => index === self.findIndex(t => t.id === thing.id)
    );

    this.state = {
      dataSource: [],
      fetchDone: false,
      loading: false,
      error: null,
      sortDirection: "asc",
      sortColumn: sortingColumns[0],
      sortOptionsVisible: false,
      sortOptionsMenuCoord: { x: 0, y: 0 },
      columns: columns,
      sortingColumns: sortingColumns,
      filterQuery: "",
      offset: 0,
      limit: 20
    };

    this.searchDebounced = debounce(300, this.initialFetchData);
  }

  componentDidMount() {
    const { filterQuery } = this.state;
    this.initialFetchData(filterQuery);
  }

  initialFetchData(filterQuery) {
    this.setState(
      {
        loading: true,
        dataSource: [],
        offset: 0
      },
      () => {
        this.waitingForQuery = filterQuery;

        fetchNbcDataCount({ filterQuery, territoryName: this.territory.name })
          .then(data => {
            if (filterQuery === this.waitingForQuery) {
              this.setState(
                () => {
                  return {
                    totalSize: data.totalSize,
                    error: null
                  };
                },
                () => {
                  const { offset, limit } = this.state;
                  this.fetchData(filterQuery, limit, offset);
                }
              );
            }
          })
          .catch(e => {
            this.setState(() => {
              return {
                loading: false,
                error: e.message
              };
            });
            console.log(e);
          });
      }
    );
  }

  fetchData(filterQuery, limit, offset) {
    const { sortColumn, sortDirection, dataSource } = this.state;

    return fetchNbcData({
      filterQuery,
      limit,
      offset,
      sortColumn,
      sortDirection,
      territoryName: this.territory.name,
    })
      .then(data => {
        const records = data.records.map((item, index) => {
          return { ...item, index };
        });

        let dataWithDelta =
          offset > 0 ? dataSource.concat(records) : records;

        this.setState(() => {
          return {
            dataSource: dataWithDelta,
            fetchDone: dataWithDelta,
            loading: false,
            queryLocator: data.queryLocator,
            error: null
          };
        });
      })
      .catch(e => {
        this.setState(() => {
          return {
            loading: false,
            error: e.message
          };
        });
        console.log(e);
      });
  }

  queryMore() {
    const { limit, offset, totalSize, loading } = this.state;

    if (loading || totalSize <= offset + limit) return null;

    this.setState(
      () => {
        return {
          loading: true,
          offset: offset + limit
        };
      },
      () => {
        const { filterQuery, limit, offset } = this.state;
        this.fetchData(filterQuery, limit, offset);
      }
    );
  }

  toggleSortDirection() {
    const { filterQuery, sortDirection } = this.state;

    this.setState(
      () => {
        return {
          sortDirection: sortDirection === "asc" ? "desc" : "asc"
        };
      },
      () => {
        this.initialFetchData(filterQuery);
      }
    );
  }

  sortBy(sortColumn) {
    const { filterQuery } = this.state;

    this.setState(
      () => {
        return {
          sortColumn
        };
      },
      () => {
        this.initialFetchData(filterQuery);
        this.closeSortOptions();

        const columnToShow = this.state.columns.find(
          currCol => sortColumn.id === currCol.id
        );

        if (!columnToShow) {
          this.setState(() => {
            const newStateColumns = [...this.state.columns];
            newStateColumns[newStateColumns.length - 1] = sortColumn;

            return {
              columns: newStateColumns
            };
          });
        }
      }
    );
  }

  showDetailsScreen(nbcAccountData) {
    const { navigate } = this.props.navigation;

    navigate("AccountDetails", {
      nbcAccountData,
      parentScreenTitle: this.title
    });
  }

  renderFooter = () => {
    const { theme } = this.props;

    if (!this.state.loading) return null;
    return (
      <ActivityIndicator
        animating={true}
        color={theme.colors.primary}
        style={{ paddingVertical: 10, minHeight: 80 }}
      />
    );
  };

  changeQuery = q => {
    this.setState({ filterQuery: q }, () => {
      const filterQuery = this.state.filterQuery;
      this.searchDebounced(filterQuery);
    });
  };

  render() {
    const {
      filterQuery,
      dataSource,
      sortOptionsVisible,
      sortOptionsMenuCoord,
      sortColumn,
      sortingColumns,
      error,
      loading
    } = this.state;
    const { navigation, theme } = this.props;

    const styles = StyleSheet.create({
      buttonWrapper: {
        paddingHorizontal: 21
      },
      button: {
        paddingVertical: 10
      },
      buttonText: {
        color: "#2bb3fe",
        fontSize: 16
      },
      header: {
        backgroundColor: theme.dark
          ? theme.colors.background
          : theme.colors.surface,
        flexDirection: isMobilePhone ? "column" : "row",
        padding: 4,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "space-between"
      },
      screen: {
        minHeight: 100 + "%",
        flexDirection: "column",
        ...Platform.select({
          web: {
            flex: 1,
          }
        })
      },
      noData: {
        textAlign: "center",
        fontSize: 20,
        width: 100 + "%",
        height: 100 + "%",
        backgroundColor: theme.dark ? theme.colors.background : "#f2f2f2",
        color: "#c0c0c0",
        paddingVertical: 30
      },
      list: {
        backgroundColor: theme.dark ? theme.colors.background : "#f2f2f2",
        flex: 1,
        paddingVertical: 5
      }
    });

    const controls = (
      <Fragment>
        <View style={styles.buttonWrapper}>
          <Menu
            visible={sortOptionsVisible}
            onDismiss={this.closeSortOptions}
            anchor={
              <TouchableOpacity style={styles.button} onPress={this.openSortOptions}>
                <Text style={styles.buttonText}>Sort By: {sortColumn.title}</Text>
              </TouchableOpacity>
            }
          >
            {sortingColumns.map((column, i) => {
              return (
                <View key={i}>
                  <Menu.Item
                    key={i}
                    onPress={() => this.sortBy(column)}
                    title={column.title}
                  />
                </View>
              );
            })}
          </Menu>
        </View>
        <IconButton
          icon={this.state.sortDirection === "asc" ? "arrow-down" : "arrow-up"}
          color="#2bb3fe"
          size={20}
          onPress={() => this.toggleSortDirection()}
        />
      </Fragment>
    );

    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Search
            style={{ width: isMobilePhone ? "100%" : "70%" }}
            placeholder="Search"
            onChangeText={q => this.changeQuery(q)}
            value={filterQuery}
            onIconPress={() => {
              this.searchDebounced(filterQuery);
              this.changeQuery("");
            }}
          />
          {isMobilePhone ? (
            <View style={{ flexDirection: "row" }}>{controls}</View>
          ) : (
            controls
          )}
        </View>

        {!dataSource.length && !loading && !error ? (
          <Text style={styles.noData}>No Data Found</Text>
        ) : null}
        {!loading && error ? (
          <Text style={styles.noData}>Something went wrong</Text>
        ) : null}

        <View style={styles.list}>
          <FlatList
            ref={ref => {
              this._listView = ref;
            }}
            data={dataSource}
            extraData={this.state}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{ marginHorizontal: 10, marginBottom: 4 }}
                  key={`${index}`}
                  onPress={() => this.showDetailsScreen(item)}
                  testID={`list-item-${index}`}
                >
                  <AccountItem
                    index={item.index}
                    key={`${index}`}
                    itemData={item}
                    columns={this.state.columns}
                    navigation={navigation}
                  />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              this.queryMore();
            }}
            ListFooterComponent={() => this.renderFooter()}
          />
        </View>
      </View>
    );
  }
}

export default withTheme(AccountsScreen);
