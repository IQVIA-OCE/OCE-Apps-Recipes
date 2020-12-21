import React, { useEffect } from 'react';
import { Tabs, Card, IconMenuButton, themeGrey } from 'apollo-react-native';
import { Text, View } from 'react-native';
import InventoriesList from './InventoriesList/InventoriesList';
import ViewAll from '../../../components/ViewAll/ViewAll';
import { useFetcher, useHandleData } from '../../../hooks';
import { fetchInventories, fetchListId } from '../../../api/Inventories';
import { getMenuItems, normalizeInventories } from './utils';

const EmptyList = () => (
  <View>
    <Text>No available Inventories</Text>
  </View>
);

const InventoriesWidget = ({ recordTypes, navigation }) => {
  const [listId] = useFetcher(fetchListId, data => data[0].Id);
  const [inventories, { handleFetch }] = useFetcher(
    fetchInventories,
    normalizeInventories(recordTypes.all)
  );

  useEffect(() => {
    const event = navigation.addListener('didFocus', () => {
      handleFetch();
    });
    return () => event.remove();
  }, [navigation]);

  return (
    <Card>
      <Card.Title
        title="Inventories"
        right={() => (
          <>
            {!inventories.loading && (
              <IconMenuButton
                size="small"
                menuItems={getMenuItems(navigation, {
                  inventories: inventories.data,
                  recordTypes,
                })}
                iconColor={themeGrey[700]}
              />
            )}
          </>
        )}
      />
      <Card.Content>
        {recordTypes
          ? useHandleData(inventories)(data => {
              return (
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
                      {data.all.length ? (
                        <>
                          <InventoriesList list={data.all} />
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
                      {data.AdHocInventory && data.AdHocInventory.length ? (
                        <InventoriesList list={data.AdHocInventory} />
                      ) : (
                        <EmptyList />
                      )}
                    </Tabs.Item>
                    <Tabs.Item>
                      {data.AuditedInventory && data.AuditedInventory.length ? (
                        <InventoriesList list={data.AuditedInventory} />
                      ) : (
                        <EmptyList />
                      )}
                    </Tabs.Item>
                    <Tabs.Item>
                      {data.InitialInventory && data.InitialInventory.length ? (
                        <InventoriesList list={data.InitialInventory} />
                      ) : (
                        <EmptyList />
                      )}
                    </Tabs.Item>
                    <Tabs.Item>
                      {data.PeriodicInventory &&
                      data.PeriodicInventory.length ? (
                        <InventoriesList list={data.PeriodicInventory} />
                      ) : (
                        <EmptyList />
                      )}
                    </Tabs.Item>
                  </Tabs.Container>
                </Tabs>
              );
            })
          : null}
      </Card.Content>
    </Card>
  );
};

export default InventoriesWidget;
