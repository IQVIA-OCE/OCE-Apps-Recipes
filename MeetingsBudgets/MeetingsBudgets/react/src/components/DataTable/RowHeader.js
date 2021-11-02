import React from 'react';
import { StyleSheet, View } from 'react-native';

const RowHeader = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fb',
    flexDirection: 'row',
  },
});

export default RowHeader;
