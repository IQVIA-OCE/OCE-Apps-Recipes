import React, { useContext, useState } from 'react';
import { Grid, Tabs, secondaryBlue, Text } from 'apollo-react-native';
import ProductsList from '../../components/ProductsList/ProductsList';
import InventoryTable from './InventoryTable/InventoryTable';
import { StyleSheet, View } from 'react-native';
import { InventoryContext } from './InventoryContext';
import HistoryTimeline from './HistoryTimeline/HistoryTimeline';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';

const initialValue = {
  activeTabIndex: 1,
  selectedProductHistory: null,
};

const InventoryScreen = ({ push, remove, form: { values, setFieldValue } }) => {
  const [state, setState] = useState(initialValue);

  const { products, config, editingType } = useContext(InventoryContext);
  const { historyHidden } = config;
  const { activeTabIndex, selectedProductHistory } = state;

  const handleSelectProduct = product => {
    product.selected = true;
    push(product);
  };
  const handleDeselectProduct = (product, index) => {
    remove(index);
    if (product.id) {
      // saved product should be saved with the "deleted" flag
      const deletedProduct = { ...product, deleted: true };
      product.selected = false;
      product.physicalQuantity = '';
      delete product.id

      if (values.deletedProducts) {
        if (values.deletedProducts.find(el => el.id === deletedProduct.id)) {
          return;
        }

        setFieldValue('deletedProducts', [
          ...values.deletedProducts,
          deletedProduct,
        ]);
      } else {
        setFieldValue('deletedProducts', [deletedProduct]);
      }
    }
  };
  const changeActiveTabIndex = tabIndex => {
    setState(prevState => ({
      ...prevState,
      activeTabIndex: tabIndex,
    }));
  };
  const showProductHistory = product => {
    changeActiveTabIndex(editingType === INVENTORY_FORM_TYPE.edit ? 2 : 1);

    setState(prevState => ({
      ...prevState,
      selectedProductHistory: product,
    }));
  };
  const clearSelectedProduct = () => {
    setState(prevState => ({
      ...prevState,
      selectedProductHistory: null,
    }));
  };

  return (
    <Grid style={styles.content}>
      <Grid.Container spacing={0} style={styles.content}>
        {editingType === INVENTORY_FORM_TYPE.edit || !historyHidden ? (
          <Grid.Item size={3}>
            <Tabs
              defaultActiveIndex={1}
              style={styles.content}
              activeIndex={activeTabIndex}
              onSelect={index => changeActiveTabIndex(index)}
            >
              <Tabs.ButtonsContainer
                style={{
                  marginBottom: 0,
                  flexGrow: 0,
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                }}
              >
                {editingType === INVENTORY_FORM_TYPE.edit && (
                  <Tabs.Button
                    renderComponent={() => (
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.icon}>
                          <Icon name="view-grid" size={17} color="white" />
                        </View>
                        <Text>PRODUCTS</Text>
                      </View>
                    )}
                  />
                )}

                {historyHidden ? (
                  <Tabs.Button text="" />
                ) : (
                  <Tabs.Button
                    renderComponent={() => (
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.icon}>
                          <Icon name="history" size={17} color="white" />
                        </View>
                        <Text>HISTORY</Text>
                      </View>
                    )}
                  />
                )}
              </Tabs.ButtonsContainer>
              <Tabs.Container style={styles.content}>
                {editingType === INVENTORY_FORM_TYPE.edit && (
                  <Tabs.Item style={styles.content}>
                    <ProductsList
                      data={products.map(el => {
                        const selected = values.products.find(
                          selectedProduct => {
                            return (
                              el.lotNumberId === selectedProduct.lotNumberId
                            );
                          }
                        );

                        return {
                          ...el,
                          selected: Boolean(selected && selected.lotNumberId),
                        };
                      })}
                      onItemPress={handleSelectProduct}
                    />
                  </Tabs.Item>
                )}
                {historyHidden ? (
                  <Tabs.Item />
                ) : (
                  <Tabs.Item style={[styles.content, { paddingTop: 10 }]}>
                    <HistoryTimeline
                      product={selectedProductHistory}
                      clearSelectedProduct={clearSelectedProduct}
                    />
                  </Tabs.Item>
                )}
              </Tabs.Container>
            </Tabs>
          </Grid.Item>
        ) : (
          <Grid.Item />
        )}

        <Grid.Item
          size={
            editingType !== INVENTORY_FORM_TYPE.edit && historyHidden ? 12 : 9
          }
        >
          <InventoryTable
            removeRow={handleDeselectProduct}
            showProductHistory={showProductHistory}
          />
        </Grid.Item>
      </Grid.Container>
    </Grid>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  icon: {
    borderRadius: 4,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: secondaryBlue[200],
  },
});

export default InventoryScreen;
