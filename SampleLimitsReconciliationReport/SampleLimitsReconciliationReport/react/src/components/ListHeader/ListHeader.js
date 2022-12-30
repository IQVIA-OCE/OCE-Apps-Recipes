import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { themeSecondary } from 'apollo-react-native';

export const ListHeader = ({ titles }) => {
  return (
    <View style={styles.listHeader}>
      {titles.map((field, key) => (
        <View key={key} style={styles.headerCell}>
          <Text style={styles.title}>{field}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    backgroundColor: themeSecondary[500],
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
  },
  headerCell: {
    flex: 1,
    flexDirection: 'row',
    borderRightWidth: 2,
    borderRightColor: 'white',
  },
  title: {
    fontSize: Platform.OS !== 'web' ? 18 : '',
    flex: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});
