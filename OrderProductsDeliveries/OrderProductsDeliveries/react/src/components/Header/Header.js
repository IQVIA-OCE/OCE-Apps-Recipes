import React from 'react';
import { View, StyleSheet } from 'react-native';
import Filter from './Filter';
import Search from './Search';
import AccountsFilter from './AccountsFilter';
import { Headline, useTheme } from 'apollo-react-native';

export const Header = ({ recordId }) => {
  const theme = useTheme();
  const backgroundColor = theme.dark ? '#2c2c2f' : '#fff';
  return (
    <View style={{ paddingBottom: 20, backgroundColor }}>
      <Headline>Deliveries</Headline>
      <View style={styles.settingsContainer}>
        <AccountsFilter />
        <Search />
        <Filter />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
