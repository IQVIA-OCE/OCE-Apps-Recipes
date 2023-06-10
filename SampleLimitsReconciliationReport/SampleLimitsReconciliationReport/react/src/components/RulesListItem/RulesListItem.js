import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'apollo-react-native';
import color from 'color';
import { useScrollbarWidth } from '../../hooks/useScrollbarWidth';

export const RulesListItem = ({ rules }) => {
  const scrollbarWidth = useScrollbarWidth();

  const { period, quota, rulesInfo, remaining } = rules;
  const tableDate = ['', '', '', rulesInfo, period, quota, remaining];
  const theme = useTheme();
  const rowBackColor = theme.dark
    ? color(theme.colors.surface).lighten(0.3).hex()
    : theme.colors.surface;

  const rowBorderBottomColor = theme.dark
    ? color(theme.colors.surface).lighten(0.9).hex()
    : color(theme.colors.surface).darken(0.15).hex()

  const values = Object.values(tableDate);

  return (
    <View style={[styles.row, {
      borderBottomColor: rowBorderBottomColor,
      backgroundColor: rowBackColor,
      borderRightWidth: 1,
      borderRightColor: theme.colors.surface,
    }]}>
      {values.map((field, index) => (
        <View
          key={index}
          style={[
            styles.cell,
            { borderRightColor: 'transparent' },
            Platform.OS === 'web' && index === values.length - 1 && { marginRight: -scrollbarWidth }
          ]}>
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
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    borderRightWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: 150,
  },
});
