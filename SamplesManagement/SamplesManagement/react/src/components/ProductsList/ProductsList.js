import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { Search, Title, Colors, TextInput } from 'apollo-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductListItem from './ProductListItem';

const ProductsList = ({ refreshing, onRefresh, data, onItemPress }) => {
  const [{ filter }, setValue] = useState({
    filter: '',
  });

  const filteredProducts = () => {
    return (
      data &&
      data.allIds &&
      data.allIds.length &&
      data.allIds.filter(id => {
        return data.byId[id].productName
          .toLowerCase()
          .includes(filter.toLocaleLowerCase());
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.icon}>
          <Icon name="view-grid" size={17} color="white" />
        </View>
        <Title style={styles.title}>PRODUCTS</Title>
      </View>

      <FlatList
        data={filteredProducts()}
        style={styles.list}
        keyExtractor={item => item.Id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <ProductListItem
            item={data && data.byId[item]}
            onPress={onItemPress}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Search
              placeholder="Search"
              value={filter}
              onChangeText={text =>
                setValue(prevState => ({
                  ...prevState,
                  filter: text,
                }))
              }
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    borderRightColor: Colors.themeGrey[200],
    borderRightWidth: 1,
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.themeGrey[200],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 17,
  },
  list: {
    flexGrow: 1,
    height: 100,
  },
  icon: {
    borderRadius: 4,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
    marginRight: 10,
    backgroundColor: Colors.secondaryBlue[200],
  },
});

export default ProductsList;
