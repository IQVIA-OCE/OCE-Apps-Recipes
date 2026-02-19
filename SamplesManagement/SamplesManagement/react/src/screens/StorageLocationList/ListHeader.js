import React from 'react';
import { StyleSheet, View } from 'react-native';
import { themeGrey, Text, useTheme } from '@oce-apps/apollo-react-native';

const ListHeader = () => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.dark ? themeGrey[900] : themeGrey[200],
        },
      ]}
    >
      <View style={styles.col}>
        <Text style={styles.title}>ADDRESS</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.title}>DEFAULT STORAGE LOCATION</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  col: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default ListHeader;
