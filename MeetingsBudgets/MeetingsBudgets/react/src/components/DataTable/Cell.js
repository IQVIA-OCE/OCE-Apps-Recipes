import { Text } from 'apollo-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const DATA_TABLE_CELL_HEIGHT = 48;

const Cell = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    minHeight: DATA_TABLE_CELL_HEIGHT,
  },
  text: {
    fontSize: 14,
  },
});

export default Cell;
