import { Text, useTheme } from 'apollo-react-native';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DATA_TABLE_CELL_HEIGHT = 48;

const DATA_TABLE_SORTING_ICON = {
  ascending: 'arrow-down',
  descending: 'arrow-up',
  default: null,
};

const ColumnTitle = ({
  children,
  columnIndex,
  sortOrder,
  style,
  onSortColumn,
}) => {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback
      onPress={() => onSortColumn(columnIndex, sortOrder)}
      testID={'columnTitle-touchable'}
    >
      <View style={[styles.container, style]}>
        <Text style={styles.text} numberOfLines={1}>
          {children}
        </Text>
        <Icon
          name={
            DATA_TABLE_SORTING_ICON[sortOrder] ||
            DATA_TABLE_SORTING_ICON.default
          }
          size={16}
          testID={'columnTitle-icon'}
          color={theme.colors.text}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: DATA_TABLE_CELL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingRight: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ColumnTitle;
