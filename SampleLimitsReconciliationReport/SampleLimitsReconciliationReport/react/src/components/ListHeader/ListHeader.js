import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@oce-apps/apollo-react-native';
import color from 'color';

export const ListHeader = ({ titles }) => {
  const theme = useTheme();
  const titleTextColor = theme.dark ? theme.colors.text : theme.colors.surface;

  return (
    <View style={[styles.listHeader,
      {
        backgroundColor: color(theme.colors.secondary).lighten(0.001).hex(),
        borderBottomColor: theme.colors.surface,
      }]}>
      {titles.map((field, key) => (
        <View key={key} style={[styles.headerCell, { borderRightColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: titleTextColor }]}>{field}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    borderBottomWidth: 4,
  },
  headerCell: {
    flex: 1,
    flexDirection: 'row',
    borderRightWidth: 2,
  },
  title: {
    fontSize: Platform.OS !== 'web' ? 18 : '',
    flex: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
