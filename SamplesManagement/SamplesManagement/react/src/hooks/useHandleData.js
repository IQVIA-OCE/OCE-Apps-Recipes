import { View } from 'react-native';
import { ActivityIndicator, useTheme } from '@oce-apps/apollo-react-native';
import React from 'react';
import { Text } from '@oce-apps/apollo-react-native';

export const useHandleData = ({ loading, error = 'Error', data }) => {
  const theme = useTheme();

  return (fn) => {
    if (loading)
      return (
        <ActivityIndicator
          animating={true}
          color={theme.colors.primary}
          style={{ paddingVertical: 10 }}
        />
      );
    if (error)
      return (
        <View>
          <Text>{error && error.message || error}</Text>
        </View>
      );

    return fn(data);
  };
};
