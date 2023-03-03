import React from "react";
import { View, Text } from "react-native";
import {useTheme} from "apollo-react-native";

const ErrorView = () => {
  const theme = useTheme();

  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface }} testID="error-view">
          <Text style={{color: theme.colors.text}}>Error. Something gone wrong.</Text>
      </View>
  );
};

export default ErrorView;
