import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { Search, Menu, ApolloProgress, useTheme } from '@oce-apps/apollo-react-native';
import { localized, environment } from '@oce-apps/oce-apps-bridges';
import useDebounce from '../../utils/useDebounce';
import { useDispatch } from 'react-redux';
import { fetchAccounts } from '../../api/ordersApi';
import { fetchOrdersList, setAccountId, setAccountName } from '../../store/orders/ordersSlice';

const AccountsFilter = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const NAMESPACE = environment.namespace();
  const [accountsList, setAccountsList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isListLoading, setListLoading] = useState(false);
  const timerRef = useRef(null);

  const debouncedSearch = useDebounce(searchValue, 500);

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

  const onAccountSelect = (el) => {
    setSearchValue(el.label);
    dispatch(fetchOrdersList(el.value));
    dispatch(setAccountName(el.label));
    dispatch(setAccountId(el.value));
    setMenuVisible(false);

    timerRef.current = setTimeout(() => {
      Keyboard.dismiss()
    }, 100);
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    fetchAccountsList(searchValue);
  }, [debouncedSearch]);

  return (
    <Menu
      visible={isMenuVisible}
      onDismiss={() => setMenuVisible(false)}
      testID="menu"
      anchor={
        <Search
          testID="search"
          placeholder={localized(`${NAMESPACE}account_name`, 'Account Name')}
          onFocus={() => {
            setMenuVisible(true)
          }}
          onChangeText={(value) => {
            if (value && value !== searchValue) setMenuVisible(true);
            setSearchValue(value);
          }}
          onSubmitEditing={Keyboard.dismiss}
          onIconPress={() => {
            dispatch(setAccountName(null))
            dispatch(setAccountId(null))
            dispatch(fetchOrdersList());
            setSearchValue('');
            Keyboard.dismiss();
          }}
          value={searchValue}
          style={{ width: 250 }}
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
              testID={`menu-item-${el.value}`}
              onPress={() => onAccountSelect(el)}
            />
          );
        })}
      </ScrollView>
    </Menu>
  );
};

const styles = StyleSheet.create({
  content: {
    width: 250,
  },
  listLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
    zIndex: 2,
  },
});

export default AccountsFilter;
