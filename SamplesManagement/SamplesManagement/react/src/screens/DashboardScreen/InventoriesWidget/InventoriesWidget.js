import React from 'react';
import { Tabs } from 'apollo-react-native';
import { StyleSheet, Text, View } from 'react-native';
import InventoriesList from './InventoriesList/InventoriesList';
import ViewAll from '../../../components/ViewAll/ViewAll';
import { useFetcher } from '../../../hooks';
import { fetchListId } from '../../../api/Inventories';

const EmptyList = () => (
  <View>
    <Text>No available Inventories</Text>
  </View>
);

const InventoriesWidget = ({ inventories, recordTypes }) => {
  const [listId] = useFetcher(fetchListId, data => data[0].Id);

  return recordTypes ? (
    <Tabs defaultActiveIndex={1}>
      <Tabs.ButtonsContainer activeTabIndex={1}>
        <Tabs.Button text="All" />
        <Tabs.Button text="Ad Hoc Inventory" />
        <Tabs.Button text="Audited Inventory" />
        <Tabs.Button text="Initial Inventory" />
        <Tabs.Button text="Periodic Inventory" />
      </Tabs.ButtonsContainer>
      <Tabs.Container activeTabIndex={1}>
        <Tabs.Item>
          {inventories.all.length ? (
            <>
              <InventoriesList list={inventories.all} />
              {listId.data && (
                <ViewAll
                  url={`{EndPoint}&retURL=%2Flightning%2Fo%2FOCE__SampleInventory__c%2Flist%3FfilterName%3D${listId.data}`}
                />
              )}
            </>
          ) : (
            <EmptyList />
          )}
        </Tabs.Item>
        <Tabs.Item>
          {inventories.AdHocInventory && inventories.AdHocInventory.length ? (
            <InventoriesList list={inventories.AdHocInventory} />
          ) : (
            <EmptyList />
          )}
        </Tabs.Item>
        <Tabs.Item>
          {inventories.AuditedInventory &&
          inventories.AuditedInventory.length ? (
            <InventoriesList list={inventories.AuditedInventory} />
          ) : (
            <EmptyList />
          )}
        </Tabs.Item>
        <Tabs.Item>
          {inventories.InitialInventory &&
          inventories.InitialInventory.length ? (
            <InventoriesList list={inventories.InitialInventory} />
          ) : (
            <EmptyList />
          )}
        </Tabs.Item>
        <Tabs.Item>
          {inventories.PeriodicInventory &&
          inventories.PeriodicInventory.length ? (
            <InventoriesList list={inventories.PeriodicInventory} />
          ) : (
            <EmptyList />
          )}
        </Tabs.Item>
      </Tabs.Container>
    </Tabs>
  ) : null;
};

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default InventoriesWidget;
