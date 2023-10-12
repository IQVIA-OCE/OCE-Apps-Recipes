import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, Keyboard, Platform } from 'react-native';
import { Search, Menu, ApolloProgress, useTheme } from 'apollo-react-native';
import { fetchAccounts } from './../../api/OrderDetails';
import { localized, environment } from 'oce-apps-bridges';
import { setRecordId, setOrderDeliveries, setAccountFilterVisible } from '../../stores/orders';
import useDebounce from '../../utils/useDebounce';
import { useDispatch } from 'react-redux';

const AccountsFilter = () => {
  const dispatch = useDispatch();
  const NAMESPACE = environment.namespace();
  const [accountsList, setAccountsList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isListLoading, setListLoading] = useState(false);

  const theme = useTheme();

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    fetchAccountsList(searchValue);
  }, [debouncedSearch]);

  const fetchAccountsList = async (value) => {
    try {
      setListLoading(true);
      const { records } = await fetchAccounts(value.trim());
      const normalizedAccounts = records.map((el) => {
        return {
          label: el.Name,
          value: el.Id,
        };
      });
      setAccountsList(normalizedAccounts);
      setListLoading(false);
    } catch (e) {
      console.warn({ e });
    }
  };

  return (
    <Menu
      visible={isMenuVisible}
      onDismiss={() => setMenuVisible(false)}
      testID="menu"
      anchor={
        <Search
          testID="search"
          placeholder={localized(`${NAMESPACE}account_name`, 'Account Name')}
          onFocus={() => setMenuVisible(true)}
          onChangeText={(value) => {
            if (value && Platform.OS !== 'web') setMenuVisible(true);
            setSearchValue(value);
          }}
          onSubmitEditing={Keyboard.dismiss}
          onIconPress={async () => {
            dispatch(setRecordId(null));
            setSearchValue('');
            dispatch(setOrderDeliveries([]));
            Keyboard.dismiss();
          }}
          value={searchValue}
          style={{ width: 300 }}
        />
      }
    >
      {isListLoading && (
        <View style={[styles.listLoader, { backgroundColor: theme.colors.surface }]} testID="loading">
          <ApolloProgress />
        </View>
      )}
      {accountsList.length === 0 && (
        <Text style={{ textAlign: 'center', paddingVertical: 20 }} testID="noelement">
          No accounts found
        </Text>
      )}
      <ScrollView
        style={{ maxHeight: 300, width: 295 }}
        keyboardShouldPersistTaps="always"
        testID="accountList"
      >
        {accountsList.map((el) => {
          return (
            <Menu.Item
              key={el.value}
              title={el.label}
              onPress={() => {
                dispatch(setRecordId(el.value));
                dispatch(setAccountFilterVisible(true));
                setSearchValue(el.label);
                setMenuVisible(false);
                Keyboard.dismiss();
              }}
            />
          );
        })}
      </ScrollView>
    </Menu>
  );
};

const styles = StyleSheet.create({
  content: {
    width: 300,
  },
  listLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 2,
  },
});

export default AccountsFilter;
