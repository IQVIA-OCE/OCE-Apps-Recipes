import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ActivityListItem = ({ data }) => {
  return (
    <View style={styles.row}>
      {Object.values(data).map((field, key) => (
        <View key={key} style={styles.cell}>
          <Text>{field}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: 'rgba(35, 114, 253, 0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  cell: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: 150,
  },
});
