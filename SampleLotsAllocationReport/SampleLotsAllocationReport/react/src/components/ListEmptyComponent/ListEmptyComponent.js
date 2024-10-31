import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Text } from '@oce-apps/apollo-react-native';

export const ListEmptyComponent = ({ loadingStatus, data, text, ...props }) => {
  const theme = useTheme();
  return (
    <View {...props} style={[styles.emptyList, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 20 }}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyList: {
    alignSelf: 'center',
    marginTop: 100,
    flex: 1,
    alignContent: 'center',
    padding: 10
  },
});
