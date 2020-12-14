import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { themeGrey } from 'apollo-react-native';

const ListHeader = () => {
  return (
    <View style={styles.root}>
      <View style={styles.col}>
        <Text style={styles.title}>ADDRESS</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.title}>DEFAULT STORAGE LOCATION</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    backgroundColor: themeGrey[50],
    borderColor: themeGrey[200],
  },
  col: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default ListHeader;
