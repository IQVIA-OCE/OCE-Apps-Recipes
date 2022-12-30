import React from 'react';
import { View, StyleSheet } from 'react-native';
import Filter from './Filter';
import Search from './Search';
import AccountsFilter from './AccountsFilter';
import { Headline } from 'apollo-react-native';

const Header = ({ recordId }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Headline>Deliveries</Headline>
      <View style={styles.settingsContainer}>
        {!recordId && <AccountsFilter />}
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

export default Header;
