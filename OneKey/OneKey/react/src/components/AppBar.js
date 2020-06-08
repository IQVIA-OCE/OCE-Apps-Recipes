import React from "react";
import PropTypes from "prop-types";

import { Appbar as ApolloAppBar } from 'apollo-react-native';

const propTypes = {
    navigation: PropTypes.object,
    navigationOptions: PropTypes.object,
};

const AppBar = props => {
    const { navigation, navigationOptions } = props;

    const openValidationRequestForm = () => {
        const {navigate} = navigation;

        navigate('OneKeyValidationRequest');
    }

    return (
        <ApolloAppBar {...props}>
            {
                navigation.isFirstRouteInParent() ?
                    null :
                    <ApolloAppBar.BackAction onPress={() => navigation.goBack()} />
            }

            <ApolloAppBar.Content
                title={navigationOptions.title}
            />

            {
                navigationOptions.title === "Accounts" ?
                    <ApolloAppBar.Action icon="account-plus" onPress={() => openValidationRequestForm()} /> : null
            }

            {/* {
                navigationOptions.title === "Create Validation Request" ?
                    <ApolloAppBar.Action icon="checkbox-marked-circle-outline"  onPress={navigationOptions.handleOneKeySubmit} /> : null
            } */}

        </ApolloAppBar>
    )
}

AppBar.propTypes = propTypes;

export default AppBar;
