import { Text, useTheme } from '@oce-apps/apollo-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../utils';
import color from 'color';

const RowPhone = ({ item, columns, phoneSortedColumn, onRowPress }) => {
  const theme = useTheme();

  return (
    <View testID={'rowPhone'}>
      <TouchableOpacity
        onPress={() => onRowPress(item)}
        testID={'rowPhone-touchable'}
      >
        <Text style={styles.mainCell}>{item[phoneSortedColumn]}</Text>
        <View style={styles.rowsContainer}>
          <View
            style={[styles.titlesContainer, {
              borderColor: theme.dark
                ? theme.colors.tertiary
                : color(theme.colors.tertiary).lighten(0.95).hex(),
            }]}
          >
            {columns.map((column, index) =>
              column.accessor !== phoneSortedColumn ? (
                <Text
                  key={`column-title_${index}`}
                  style={styles.title}
                  numberOfLines={1}
                >
                  {column.header}
                </Text>
              ) : null
            )}
          </View>
          <View style={styles.cellsContainer}>
            {columns.map((column, index) =>
              column.accessor !== phoneSortedColumn ? (
                <Text
                  key={`${item.id}_${index}`}
                  style={[styles.cell, { color: theme.colors.tertiary }]}
                  numberOfLines={1}
                >
                  {column.isDate
                    ? formatDate(item[column.accessor])
                    : item[column.accessor]}
                </Text>
              ) : null
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainCell: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  rowsContainer: {
    flexDirection: 'row',
  },
  titlesContainer: {
    width: '45%',
    borderRightWidth: 1,
  },
  cellsContainer: {
    width: '55%',
  },
  title: {
    paddingLeft: 15,
    paddingRight: 5,
    fontWeight: '500',
  },
  cell: {
    paddingRight: 15,
    paddingLeft: 5,
  },
});

export default RowPhone;
