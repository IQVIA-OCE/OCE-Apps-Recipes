import React, { useContext } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { InventoryContext } from '../InventoryContext';
import HistoryTimelineItem from './HistoryTimelineItem';
import {
  secondaryBlue,
  black,
  IconButton,
  themeGrey,
} from 'apollo-react-native';

const HistoryTimeline = ({ product, clearSelectedProduct }) => {
  const { productsHistory } = useContext(InventoryContext);
  const filteredHistory = product
    ? productsHistory.filter(
        productHistory =>
          productHistory.productId === product.sampleProductId &&
          productHistory.lotId === product.lotNumberId
      )
    : productsHistory;

  return (
    <View style={styles.container}>
      {product ? (
        <View style={styles.selectedProduct}>
          <View>
            <Text style={{ color: black[300] }}>
              {product.label} ( {product.detailLabel} )
            </Text>
          </View>
          <View>
            <IconButton
              icon="close"
              color={black[500]}
              size={20}
              onPress={clearSelectedProduct}
            />
          </View>
        </View>
      ) : null}

      <FlatList
        data={filteredHistory}
        style={styles.list}
        keyExtractor={(item, i) => `${i}`}
        renderItem={({ item }) => <HistoryTimelineItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 5,
    borderRightColor: themeGrey[200],
    borderRightWidth: 1,
  },
  list: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 17,
  },
  icon: {
    borderRadius: 4,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
    marginRight: 10,
    backgroundColor: secondaryBlue[200],
  },
  selectedProduct: {
    marginHorizontal: 15,
    paddingBottom: 10,
    borderBottomColor: '#d8dde6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HistoryTimeline;
