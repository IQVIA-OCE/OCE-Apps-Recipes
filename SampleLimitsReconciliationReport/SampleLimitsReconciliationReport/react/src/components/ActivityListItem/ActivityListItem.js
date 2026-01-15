import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@oce-apps/apollo-react-native';
import color from 'color';

export const ActivityListItem = ({ data }) => {
  const theme = useTheme();
  const rowBackColor = theme.dark
    ? color(theme.colors.surface).lighten(0.6).hex()
    : color(theme.colors.primary).red(35).alpha(0.08).string();

  return (
    <View style={[ styles.row,
      {
        backgroundColor: rowBackColor,
        borderBottomColor: theme.colors.surface,
      }]}>
      {Object.values(data).map((field, key) => (
        <View key={key} style={[styles.cell, { borderRightColor: theme.colors.surface }]}>
          <Text style={{ color: theme.colors.text }}>{field}</Text>
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
    borderBottomWidth: 2,
  },
  cell: {
    flex: 1,
    borderRightWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: 150,
    height: '100%',
  },
});
