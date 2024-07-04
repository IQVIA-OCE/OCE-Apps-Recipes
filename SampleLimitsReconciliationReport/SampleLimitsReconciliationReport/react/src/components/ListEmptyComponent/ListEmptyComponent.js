import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@oce-apps/apollo-react-native';

export const ListEmptyComponent = ({ loadingStatus, data, text, ...props }) => {
  const theme = useTheme();

  return (
    <View {...props} style={styles.emptyList}>
      <Text style={{ fontSize: 20, color: theme.colors.text }}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyList: {
    paddingTop: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
