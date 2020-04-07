import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { NavigationActions } from "../../../bridge/Navigation/NavigationActions";
import { navigator } from "../../../bridge/Navigation/ScreenNavigator";
import { environment } from "../../../bridge/EnvironmentData/EnvironmentData.native";
import { sfNetAPI } from "../../../bridge/sf/sfnetapi";

import { ActivityIndicator, Colors, IconButton, Menu, Provider, Search } from "apollo-react-native";
import AccountItem from "./accountsList/AccountItem";

import { columns, defaultSortingColumns, extraSortingColumns } from './constants/columns';
import { debounce } from "throttle-debounce";


const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 21,
        paddingVertical: 10,
    },
    buttonText: {
        color: "#2bb3fe",
        fontSize: 16,
    },
    header: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        padding: 4,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    screen: {
        minHeight: 100 + '%',
    },
    noData: {
        textAlign: "center",
        fontSize: 20,
        width: 100 + "%",
        height: 100 + "%",
        backgroundColor: "#f2f2f2",
        color: "#c0c0c0",
        paddingVertical: 30
    },
    list: {
        backgroundColor: "#f2f2f2",
        paddingTop: 5,
    }

});

export default class AccountsScreen extends React.Component {
    static title = "Accounts";
    static _listView;
    waitingForQuery = '';

    static navigationOptions = {
        title: this.title,
    };

    territory = environment.territory();

    openSortOptions = (event) => {
        const { nativeEvent } = event;

        this.setState(
            {
            sortOptionsMenuCoord: {
                x: nativeEvent.pageX,
                y: nativeEvent.pageY - 30,
            },
            },
            () => this.setState({ sortOptionsVisible: true })
        );
    };
    closeSortOptions = () => this.setState({ sortOptionsVisible: false });

    constructor(props) {
        super(props);
        const filteredColumns = columns.filter((col) => col.id !== "NextBestTime");

        const sortingColumns = [...filteredColumns, ...defaultSortingColumns, ...extraSortingColumns].filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.id === thing.id
            ))
        );

        this.state = {
            dataSource: [],
            fetchDone: false,
            loading: false,
            error: null,
            sortDirection: 'asc',
            sortColumn: sortingColumns[0],
            sortOptionsVisible: false,
            sortOptionsMenuCoord: { x: 0, y: 0 },
            columns: columns,
            sortingColumns: sortingColumns,
            filterQuery: '',
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
        const filterTerritory = `OCE__Territory__c = '${this.territory.name}'`;
        const filter = filterQuery ? `WHERE ${filterTerritory} And OCE__Account__r.Name LIKE '%${filterQuery}%'` : `WHERE ${filterTerritory}`;

        this.setState(
            {
                loading: true,
                dataSource: [] ,
                offset: 0,
            },
            () => {
                this.waitingForQuery = filterQuery;

                sfNetAPI
                    .query(`SELECT count() FROM OCE__NextBestCustomer__c ${filter}`,
                        data => {
                            if ( filterQuery === this.waitingForQuery){
                                this.setState(() => {
                                    return {
                                        totalSize: data.totalSize,
                                        error: null,
                                    };
                                },
                                    () => {
                                        const { offset, limit } = this.state;
                                        this.fetchData(filterQuery, limit, offset);
                                    }
                                )
                            }
                        },
                        e => {
                            this.setState(() => {
                                return {
                                    loading: false,
                                    error: e.message,
                                };
                            });
                            console.log(e);
                        });
            }
        );
    }

    fetchData(filterQuery, limit, offset) {
        const { sortColumn, sortDirection, dataSource } = this.state;

        const defaultCols = "Id, OCE__Account__r.Id, OCE__Account__r.Name, OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__Address__r.OCE__DisplayAddress__c, OCE__NbcData__c, OCE__TotalScore__c, OCE__Account__r.OCE__Specialty__c, OCE__Account__r.OCE__ParentAccount__r.Name,";
        const cols = "OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__SampleEligibilityStatus__c, OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__BestTime__c, OCE__Account__r.LastName, OCE__Rank__c";

        const filterTerritory = `OCE__Territory__c = '${this.territory.name}'`;
        const filter = filterQuery ? `WHERE ${filterTerritory} And OCE__Account__r.Name LIKE '%${filterQuery}%'` : `WHERE ${filterTerritory}`;

        sfNetAPI
            .query(`SELECT ${defaultCols} ${cols} FROM OCE__NextBestCustomer__c ${filter} ORDER BY ${sortColumn.accessor} ${sortDirection} LIMIT ${limit} OFFSET ${offset}`,
                data => {
                console.warn(JSON.stringify(data));
                  data.records = data.records.map((item, index) => {return {...item, index}});

                        let dataWithDelta = offset > 0 ? dataSource.concat(
                            data.records,
                        ) : data.records;

                        this.setState(() => {
                            return {
                                dataSource: dataWithDelta,
                                fetchDone: dataWithDelta,
                                loading: false,
                                queryLocator: data.queryLocator,
                                error: null,
                            };
                        });
                },
                e => {
                    this.setState(() => {
                        return {
                            loading: false,
                            error: e.message,
                        };
                    });
                    console.log(e);
                });
    }

    queryMore() {
        const { limit, offset, totalSize, loading} = this.state;

        if (loading || totalSize <= offset + limit) return null;

        this.setState(() => {
            return {
                loading: true,
                offset: offset + limit,
            };
        }, () => {
            const { filterQuery, limit, offset } = this.state;
            this.fetchData(filterQuery, limit, offset);
        });
    }

    toggleSortDirection() {
        const { filterQuery, sortDirection } = this.state;

        this.setState(() => {
            return {
                sortDirection: sortDirection === "asc" ? "desc" : "asc",
            };
        }, () => {
            this.initialFetchData(filterQuery);
        });
    }

    sortBy(sortColumn) {
        const { filterQuery } = this.state;

        this.setState(() => {
            return {
                sortColumn,
            };
        }, () => {
            this.initialFetchData(filterQuery);
            this.closeSortOptions();

            const columnToShow = this.state.columns.find(currCol => sortColumn.id === currCol.id );

            if (!columnToShow){
                this.setState(() => {
                    const newStateColumns = [...this.state.columns];
                    newStateColumns[newStateColumns.length - 1] = sortColumn;

                    return {
                        columns: newStateColumns
                    }
                })
            }
        });
    }

    showDetailsScreen(nbcAccountData) {
        const {navigate} = this.props.navigation;

        navigate('AccountDetails', {nbcAccountData, parentScreenTitle: this.title});
    }

    showCustomerDetails(customerUid) {
        const actions = NavigationActions.details({ id: customerUid });

        navigator.dispatch(actions);
    }

    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator animating={true} color={Colors.blue700} style={{paddingVertical: 10, minHeight: 80}}/>
        );
    };

    changeQuery = q => {
        this.setState({ filterQuery: q }, () => {
            const filterQuery = this.state.filterQuery;
            this.searchDebounced(filterQuery);
        });
    };

    render() {
        const { filterQuery, dataSource, sortOptionsVisible,
            sortOptionsMenuCoord, sortColumn, sortingColumns, error, loading } = this.state;

        return (
            <View style={styles.screen}>
                <View style={styles.header}>
                    <Search
                        style={{width: 70 + '%'}}
                        placeholder="Search"
                        onChangeText={this.changeQuery}
                        value={filterQuery}
                        onIconPress={() => this.searchDebounced(filterQuery)}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.openSortOptions}
                    >
                        <Text style={styles.buttonText}>Sort By: {sortColumn.title}</Text>
                    </TouchableOpacity>
                    <Provider>
                        <Menu
                            visible={sortOptionsVisible}
                            onDismiss={this.closeSortOptions}
                            anchor={sortOptionsMenuCoord}
                        >
                            {sortingColumns.map(
                                (column, i) => {
                                    return (
                                        <View key={i}>
                                            <Menu.Item key={i} onPress={() => this.sortBy(column)} title={column.title} />
                                        </View>
                                    )
                                })
                            }
                        </Menu>
                    </Provider>
                    <IconButton
                        icon={this.state.sortDirection === "asc" ? "arrow-down" : "arrow-up"}
                        color="#2bb3fe"
                        size={20}
                        onPress={() => this.toggleSortDirection()}
                    />
                </View>

                {!dataSource.length && !loading && !error ? <Text style={styles.noData}>No Data Found</Text> : null}
                {!loading && error ? <Text style={styles.noData}>Something Goes Wrong</Text> : null}

                <FlatList
                    ref={(ref) => { this._listView = ref; }}
                    data={dataSource}
                    extraData={this.state}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style = {{marginHorizontal: 10, marginBottom: 4}}
                                key = { item.OCE__Account__r.Id }
                                onPress={() => this.showDetailsScreen(item)}>
                                <AccountItem
                                    index = {item.index}
                                    key = { item.OCE__Account__r.Id }
                                    itemData = { item }
                                    columns = { this.state.columns }
                                />
                            </TouchableOpacity>
                        )}
                    }
                    keyExtractor={item => item.OCE__Account__r.Id}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {this.queryMore()}}
                    ListFooterComponent={() => this.renderFooter()}
                    style={styles.list}
                />
            </View>
        );
    }
}
