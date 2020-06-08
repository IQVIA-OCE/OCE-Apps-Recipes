import { Text, View } from 'react-native';
import { ActivityIndicator, Colors } from 'apollo-react-native';
import React from 'react';

export const useHandleData = ({ loading, error, data }) => {
  return (fn) => {
    if (loading)
      return (
        <ActivityIndicator
          animating={true}
          color={Colors.blue700}
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
