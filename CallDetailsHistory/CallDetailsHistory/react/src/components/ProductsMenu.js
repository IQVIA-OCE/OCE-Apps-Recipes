import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Menu, IconButton, Search, Checkbox } from '@oce-apps/apollo-react-native';

const ProductsMenu = ({
  selectedProducts,
  setSelectedProducts,
  setLoading,
  data,
  disabled
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [groupValue, setGroupValue] = useState(null);
  const timer = useRef(0);

  const handleGroupChange = value => {
    if (JSON.stringify(value) !== JSON.stringify(selectedProducts)) {
      setLoading(true);

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setSelectedProducts(value);
        setGroupValue(value);
        setLoading(false);
      }, 1500);

      return () => clearTimeout(timer.current);
    }
  };

  useEffect(() => {
    if (data) {
      setGroupValue(data.map(el => el.productId))
    }
  }, [data]);

  return (
    <View style={{ marginLeft: 5 }}>
      {data && data.length > 0 && (
        <Menu
          visible={isMenuVisible}
          style={{ padding: 10, width: 300 }}
          onDismiss={disabled ? () => null : () => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter"
              size={30}
              disabled={data === null || disabled}
              onPress={() => setMenuVisible(true)}
              style={{ width: 30, height: 30, marginTop: 30 }}
            />
          }
        >
          <Search
            style={styles.search}
            value={searchValue}
            onChangeText={value => setSearchValue(value)}
          />
          <Checkbox.Group
            value={groupValue}
            style={{ paddingHorizontal: 15 }}
            onChange={handleGroupChange}
          >
            <ScrollView style={{ height: 300 }}>
              {data.map(el => {
                if (
                  el.productName
                    .toLowerCase()
                    .indexOf(searchValue.toLowerCase()) !== -1
                ) {
                  return (
                    <View style={styles.row} key={el.productId}>
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          backgroundColor: el.productColor,
                        }}
                      />
                      <Checkbox value={el.productId} label={el.productName} labelStyle={{ width: 200 }} />
                    </View>
                  );
                }
              })}
            </ScrollView>
          </Checkbox.Group>
        </Menu>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    width: 265,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export default React.memo(ProductsMenu);
