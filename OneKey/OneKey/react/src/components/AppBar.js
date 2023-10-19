import React from "react";
import PropTypes from "prop-types";

import { Appbar as ApolloAppBar } from 'apollo-react-native';
import { useNavigationState, useRoute } from "@react-navigation/native";

const propTypes = {
    navigation: PropTypes.object,
    navigationOptions: PropTypes.object,
};

function useIsFirstRouteInParent() {
    const route = useRoute();
    const isFirstRouteInParent = useNavigationState(
      (state) => state.routes[0].key === route.key
    );

    return isFirstRouteInParent;
}

const AppBar = ({ navigation, scene, options, ...props }) => {
    const isFirstRouteInParent = useIsFirstRouteInParent();
    const title = options.headerTitle;

    const openValidationRequestForm = () => {
        const {navigate} = navigation;

        navigate('OneKeyValidationRequest');
    }

    return (
        <ApolloAppBar {...props}>
            {
                isFirstRouteInParent ?
                    null :
                    <ApolloAppBar.BackAction onPress={() => navigation.goBack()} />
            }

            <ApolloAppBar.Content
                title={title}
            />

            {
                title === "Accounts" ?
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
