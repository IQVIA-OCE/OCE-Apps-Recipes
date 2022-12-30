import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ListEmptyComponent = ({ loadingStatus, data, text, ...props }) => {
  return (
    <View {...props} style={styles.emptyList}>
      <Text style={{ fontSize: 20 }}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyList: {
    alignSelf: 'center',
    paddingTop: 100,
    height: '100%',
    alignItems: 'center',
  },
});
