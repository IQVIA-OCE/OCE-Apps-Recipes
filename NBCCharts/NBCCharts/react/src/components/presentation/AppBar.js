import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Appbar as ApolloAppBar } from "apollo-react-native";

const propTypes = {
  navigation: PropTypes.object,
  navigationOptions: PropTypes.object
};

import { isIphone } from "../../constants";

const AppBar = props => {
  const { navigation, navigationOptions } = props;

  return (
    <ApolloAppBar {...props}>
      {navigation.isFirstRouteInParent() ? null : (
        <ApolloAppBar.Action onPress={() => navigation.goBack()} icon="arrow-left" />
      )}

      <ApolloAppBar.Content title={navigationOptions.title} />
    </ApolloAppBar>
  );
};

AppBar.propTypes = propTypes;

export default AppBar;
