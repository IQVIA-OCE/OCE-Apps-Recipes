import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@oce-apps/apollo-react-native';

export const ListEmptyComponent = ({ isLoading = false }) => {
  const theme = useTheme();
  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]} testID={'listEmptyComponent'}>
      {isLoading ? null : <Text style={styles.text}>No Records Found</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
