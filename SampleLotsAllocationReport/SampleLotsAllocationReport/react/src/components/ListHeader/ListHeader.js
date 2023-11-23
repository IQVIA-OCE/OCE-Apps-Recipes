import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import color from 'color'
import { neutral01, useTheme, Text } from 'apollo-react-native';

export const ListHeader = ({ titles, onSort }) => {
  const theme = useTheme();
  const [sortOption, setSortoption] = useState(null);
  const [sortBy, setSortBy] = useState(false);
  const onSortColumn = (obj) => {
    onSort(obj.sortField, !sortBy);
    setSortBy(!sortBy)
    setSortoption(obj.fieldName);
  }
  return (
    <View style={[styles.listHeader, {
      backgroundColor: theme.dark ? color(theme.colors.surface).lighten(0.5).hex() : neutral01[500],
      borderBottomColor: theme.dark ? color(theme.colors.surface).darken(0.5).hex() : 'white'
    }]}>
      {(titles).map((field, key) => (
        <TouchableOpacity disabled={!field.sortField} testID={`sortColumn_${key}`} key={key} style={[styles.headerCell, {
          borderRightColor: theme.dark ? color(theme.colors.surface).darken(0.5).hex() : 'white'
        }]} onPress={() => onSortColumn(field)}>
          <View style={styles.cell}>
            <Text style={styles.title}>{field.title}</Text>
            {(sortOption === field.fieldName) && <Icon testID={`sortIcon_${key}`} color={theme.colors.text} name={sortBy ? "arrow-down" : "arrow-up"} style={styles.icon} size={14} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 4,
  },
  headerCell: {
    flex: 1,
    flexDirection: 'row',
    borderRightWidth: 2,
    alignContent: 'center',
    alignItems: 'center'
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

  },
  title: {
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  icon: {
    paddingLeft: 4,
  }
});
