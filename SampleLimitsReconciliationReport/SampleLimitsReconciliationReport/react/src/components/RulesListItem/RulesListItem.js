import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { themeGrey } from 'apollo-react-native';

export const RulesListItem = ({ rules }) => {
  const { period, quota, rulesInfo, remaining } = rules;
  const tableDate = ['', '', '', rulesInfo, period, quota, remaining];

  return (
    <View style={styles.row}>
      {Object.values(tableDate).map((field, key) => (
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
    borderBottomWidth: 1,
    borderBottomColor: themeGrey[100],
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
