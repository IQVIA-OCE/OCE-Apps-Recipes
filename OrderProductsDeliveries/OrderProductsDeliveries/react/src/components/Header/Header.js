import React from 'react';
import { View, StyleSheet } from 'react-native';
import Filter from './Filter';
import Search from './Search';
import AccountsFilter from './AccountsFilter';
import { Headline, useTheme } from '@oce-apps/apollo-react-native';
import { isAccountFilterVisibleSelector } from '../../stores/ordersSelectors';
import { useSelector } from 'react-redux';

export const Header = () => {
  const theme = useTheme();
  const backgroundColor = theme.dark ? '#2c2c2f' : '#fff';
  const isAccountFilterVisible = useSelector(isAccountFilterVisibleSelector);
  return (
    <View style={{ paddingBottom: 20, backgroundColor }}>
      <Headline>Deliveries</Headline>
      <View style={styles.settingsContainer}>
      {isAccountFilterVisible && <AccountsFilter />}
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
