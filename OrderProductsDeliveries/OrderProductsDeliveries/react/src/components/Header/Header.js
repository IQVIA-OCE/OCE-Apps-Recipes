import React from 'react';
import { View, StyleSheet } from 'react-native';
import Filter from './Filter';
import Search from './Search';
import AccountsFilter from './AccountsFilter';
import { Headline } from 'apollo-react-native';
import { useSelector } from 'react-redux';

const Header = () => {
  const { _recordType } = useSelector((state) => state.ordersListReducers);
  return (
    <View style={{ marginBottom: 20 }}>
      <Headline>Deliveries</Headline>
      <View style={styles.settingsContainer}>
        {_recordType === null ? <AccountsFilter /> : null}
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
