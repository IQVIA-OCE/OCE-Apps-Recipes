import { ApolloProgress, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const CustomProgress = ({ style, ...props }) => {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.loader,
        { backgroundColor: color(theme.colors.surface).alpha(0.8).string() },
        style,
      ]}
    >
      <ApolloProgress />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
