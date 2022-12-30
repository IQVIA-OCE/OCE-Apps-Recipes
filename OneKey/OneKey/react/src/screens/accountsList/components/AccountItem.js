import React from "react";
import PropTypes from 'prop-types';
import {Animated, Text, StyleSheet, View} from 'react-native';
import { IconButton, withTheme } from 'apollo-react-native';
import { NavigationActions, NavigationModes } from "../../../utils/NavigationActions";
import { navigator } from "oce-apps-bridges";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        borderRadius: 6,
        minHeight: 120
    },
    cell: {
        flex: 2,
        paddingVertical: 4,
        paddingHorizontal: 8
    },
    firstCell: {
        flex: 3,
    },
    title: {
        color: '#999999',
        fontSize: 13,
        marginBottom: 8
    },
    text: {
        fontSize: 14,
    },
    textCaption: {
        fontWeight: "500",
    },
    actions: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        paddingRight: 10
    }
});

const propTypes = {
    itemData: PropTypes.object,
    columns: PropTypes.array
};

const defaultProps = {
    itemData: {},
    columns: []
};

class AccountItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
        };

    }

    openVRForm = (itemData) => {
        const { navigate } = this.props.navigation;
        navigate('OneKeyValidationRequest', {itemData});
    }

    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 250,
            delay: this.props.index * 120,
            useNativeDriver: true,
        }).start();
    }

    showCustomerDetails(customerUid) {
        const actions = NavigationActions.details({ id: customerUid });

        navigator.dispatch(actions).then(r => console.log(r), e => console.log(e));
    }

    logACall(id) {
        const actions = NavigationActions.new({
            entity: "OCE__Call__c",
            mode: NavigationModes.NEW_MODE,
            parentID: id,
        });

        navigator.dispatch(actions).then(r => console.log(r), e => console.log(e));
    }

    render() {
        const { itemData, navigation, theme } = this.props;
        styles.text = {
            ...styles.text,
            color: theme.dark ? theme.colors.text : '#494949',
        }

        return (
            <Animated.View style={[styles.container, { opacity: this.state.opacity, backgroundColor: theme.colors.background }]}>
                <View style={styles.container}>
                    <View style={[styles.cell, styles.firstCell]}>
                        <Text style={[styles.title, styles.text, styles.textCaption]}>{itemData.OCE__AccountFullName__c || itemData.Name}</Text>
                        <Text style={styles.text}>{itemData.OCE__PrimaryAccountAddress__r}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text style={styles.title}>Record Type</Text>
                        <Text style={styles.text}>{itemData.OCE__RecordTypeName__c}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text style={styles.title}>Specialty</Text>
                        <Text style={styles.text}>{itemData.OCE__Specialty__c}</Text>
                    </View>

                    <View style={styles.actions}>
                        <IconButton
                            icon="account"
                            color="#2bb3fe"
                            size={25}
                            animated={true}
                            onPress={() => this.showCustomerDetails(itemData.Id)}
                        />
                        <IconButton
                            icon="phone"
                            color="#2bb3fe"
                            size={25}
                            animated={true}
                            onPress={() => this.logACall(itemData.Id)}
                        />
                        <IconButton
                            icon="pencil"
                            color={'#2bb3fe'}
                            size={25}
                            onPress={() => this.openVRForm(itemData)}
                        />
                    </View>
                </View>
            </Animated.View>
        );
    }
}

AccountItem.propTypes = propTypes;
AccountItem.defaultProps = defaultProps;

export default withTheme(AccountItem);
