import React from "react";
import PropTypes from "prop-types";
import { Appbar as ApolloAppBar } from "@oce-apps/apollo-react-native";
import { useNavigationState, useRoute } from "@react-navigation/native";

const propTypes = {
  navigation: PropTypes.object,
  options: PropTypes.object,
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

  return (
    <ApolloAppBar {...props}>
      {!isFirstRouteInParent && (
        <ApolloAppBar.Action
          onPress={() => navigation.goBack()}
          icon="arrow-left"
        />
      )}
      <ApolloAppBar.Content title={title} />
    </ApolloAppBar>
  );
};

AppBar.propTypes = propTypes;

export default AppBar;
