import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

import { sfNetAPI } from "../../../bridge/sf/sfnetapi";

import { ActivityIndicator, Colors } from "apollo-react-native";
import AccountItem from "./components/AccountItem";

import { localized } from "../../../bridge/Localization/localization.native";
import { iosLogger } from "../../../bridge/Logger/logger";

import { dbManager } from "../../../bridge/container";


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

    static navigationOptions = {
        title: "Accounts"
    }

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

    initialFetchData() {
        this.state = {
            loading: true
        }

        dbManager
            .fetch("Select Id, Name, FirstName, MiddleName, LastName, Phone, OCE__AccountFullName__c, OCE__PrimaryAccountAddress__r.OCE__City__c, OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c,OCE__RecordTypeName__c, OCE__Specialty__c from Account Order by OCE__AccountFullName__c NULLS LAST")
            .then(demoData => {
                this.setState(() => {
                    return {
                        dataSource: demoData.records,
                        fetchDone: demoData.done,
                        queryLocator: demoData.queryLocator,
                        loading: false,
                        error: null,
                    };
                });
            })
            .catch(e => {
                console.log(e.message, e.code);

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

                dbManager
                    .fetch(this.state.queryLocator)
                    .then(delta => {
                        delta.records = delta.records.map((item, index) => {return {...item, index}});

                        let dataWithDelta = this.state.dataSource.concat(
                            delta.records,
                        );

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

                        console.log(e.message, e.code);
                    });
            }
        }
    }

    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator animating={true} color={Colors.blue700} style={{paddingVertical: 10, minHeight: 80}}/>
        );
    };

    render() {
        const { dataSource } = this.state;
        const { navigation } = this.props;

        return (
            <View style={styles.screen}>

                {!dataSource.length && !this.state.loading ? <Text style={styles.noData}>No Data Found</Text> : null}
                
                <FlatList
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
                    style={styles.list}
                />
            </View>  
        );
    }
}
