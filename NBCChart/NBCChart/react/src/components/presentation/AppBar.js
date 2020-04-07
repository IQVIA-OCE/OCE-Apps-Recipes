import React from "react";
import PropTypes from "prop-types";

import { Appbar as ApolloAppBar } from 'apollo-react-native';

const propTypes = {
    navigation: PropTypes.object,
    navigationOptions: PropTypes.object,
};

const AppBar = props => {
    const { navigation, navigationOptions } = props;

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
        </ApolloAppBar>
    )
}
    
AppBar.propTypes = propTypes;
  
export default AppBar;
