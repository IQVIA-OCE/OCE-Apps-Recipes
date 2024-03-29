import React from "react";
import { StyleSheet, Text, View, FlatList, Platform } from 'react-native';

import { ActivityIndicator, withTheme } from "@oce-apps/apollo-react-native";
import AccountItem from "./components/AccountItem";

import { databaseManager } from "@oce-apps/oce-apps-bridges";


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
        flexDirection: "column",
        ...Platform.select({
            web: {
                flex: 1,
            }
        }),
    },
    noData: {
        textAlign: "center",
        fontSize: 20,
        width: 100 + "%",
        height: 100 + "%",
        color: "#c0c0c0",
        paddingVertical: 30
    },
    list: {
        paddingTop: 5,
    }

});

class AccountsScreen extends React.Component {
    _listView;

    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            loading: false,
            error: '',
            fetchDone: false,
            queryLocator: ''
        };
    }

    componentDidMount() {
        this.initialFetchData();
    }

    parseItem(key, value, acc = {}) {
        const relations = key.split('.');
        const _key = relations.shift();

        acc[_key] = relations.length ? this.parseItem(relations.join('.'), value, acc[_key]) : value;
        return acc;
    }

    parseResponse(response = []) {
        return response.map(item =>
          Object.keys(item)
            .reduce((account, key) => this.parseItem(key, item[key], account), {})
        );
    };

    initialFetchData() {
        this.setState({ loading: true });


        databaseManager
            .fetch("Select Id, Name, FirstName, MiddleName, LastName, Phone, OCE__AccountFullName__c, OCE__PrimaryAccountAddress__r.OCE__City__c, OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c,OCE__RecordTypeName__c, OCE__Specialty__c from Account Order by OCE__AccountFullName__c NULLS LAST")
            .then(demoData => {
                this.setState(() => {
                    return {
                        dataSource: this.parseResponse(demoData.records),
                        fetchDone: demoData.done,
                        queryLocator: demoData.queryLocator,
                        loading: false,
                        error: null,
                    };
                });
            })
            .catch(e => {
                this.setState(() => {
                    return {
                        loading: false,
                        error: e.message,
                    };
                });
            });
    }

    loadMore() {
        if (this.state.fetchDone === false && this.state.loading === false) {
            if (
                this.state.queryLocator != null &&
                this.state.queryLocator !== undefined
            ) {
                this.setState({ loading: true });

                databaseManager
                    .fetch(this.state.queryLocator)
                    .then(delta => {
                        delta.records = delta.records.map((item, index) => {return {...item, index}});

                        let dataWithDelta = this.state.dataSource.concat(delta.records);

                        console.log('delta.records', delta.records);

                        this.setState(() => {
                            return {
                                dataSource: dataWithDelta,
                                fetchDone: delta.done,
                                queryLocator: delta.queryLocator,
                                loading: false,
                            };
                        });
                    })
                    .catch(e => {
                        this.setState(() => {
                            return {
                                loading: false,
                                error: e.message,
                            };
                        });
                    });
            }
        }
    }

    renderFooter = () => {
        const { theme } = this.props;

        if (!this.state.loading) return null;
        return (
            <ActivityIndicator animating={true} color={theme.colors.primary} style={{paddingVertical: 10, minHeight: 80}}/>
        );
    };

    render() {
        const { dataSource } = this.state;
        const { navigation, theme } = this.props;

        return (
            <View style={styles.screen} testID={'list-wrapper'}>

                {!dataSource.length && !this.state.loading ? <Text style={[styles.noData, { backgroundColor: theme.colors.background }]}>No Data Found</Text> : null}

                <FlatList
                    testID={'accountList'}
                    ref={(ref) => { this._listView = ref; }}
                    data={dataSource}
                    extraData={this.state}
                    renderItem={({ item }) => {
                        return (
                            <View style = {{marginHorizontal: 10, marginBottom: 4}}
                                key = { item.Id }>
                                <AccountItem
                                    index = {item.index}
                                    key = { item.Id }
                                    itemData = { item }
                                    navigation={navigation}
                                />
                            </View>
                        )}
                    }
                    keyExtractor={item => item.Id}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {this.loadMore()}}
                    ListFooterComponent={() => this.renderFooter()}
                    style={[styles.list, { backgroundColor: theme.dark ? theme.colors.background : '#f2f2f2' }]}
                />
            </View>
        );
    }
}

const AccountsScreenContainer = withTheme(AccountsScreen);

export default AccountsScreenContainer;
