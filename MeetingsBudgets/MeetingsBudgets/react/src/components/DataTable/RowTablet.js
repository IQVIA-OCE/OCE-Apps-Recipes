import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../utils';
import Cell from './Cell';

export const RowTablet = ({ item, columns, columnWidth, onRowPress }) => {
  return (
    <View testID={'rowTablet'}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onRowPress(item)}
        testID={'rowTablet-touchable'}
      >
        {columns.map((column, index) => (
          <Cell
            key={`${item.id}_${index}`}
            style={{ width: columnWidth[index] || 'auto' }}
          >
            {column.isDate
              ? formatDate(item[column.accessor])
              : item[column.accessor]}
          </Cell>
        ))}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default RowTablet;
