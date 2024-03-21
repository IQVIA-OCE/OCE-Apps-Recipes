import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, neutral01, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color'

export const TableListChildItem = ({ data, index, tableHeaders, onRowPress }) => {
  const theme = useTheme();
  const { dark, colors } = theme;
  const tableData = tableHeaders.map((key) => data[key.fieldName]);
  let backgroundColor = dark ? color(theme.colors.surface).lighten(1).hex() : neutral01[700];
  if (index % 2 !== 1) {
    backgroundColor = dark ? color(theme.colors.surface).darken(0.1).hex() : 'white';
  }
  return (
    <View style={[styles.row, { backgroundColor }]}>
      <TouchableOpacity testID={`childRowItem_${index}`} style={[styles.row, { backgroundColor }]} onPress={onRowPress}>
        {Object.values(tableData).map((field, key) => (
          <View key={key} style={[styles.cellContainer, { borderRightColor: dark ? color(theme.colors.surface).darken(0.8).hex() : 'white' }]}>
            <View style={styles.cell}>
              <Text>{field}</Text>
            </View>
          </View>
        ))}

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  cellContainer: {
    borderRightWidth: 2,
    flex: 1,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: 150,
  },
});
