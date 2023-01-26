import React, {useContext, useEffect} from 'react';
import { Card, Text } from 'apollo-react-native';
import LotItem from '../../../components/LotItem/LotItem';
import { useFetcher, useHandleData } from '../../../hooks';
import { fetchLots, changeLotStatus } from '../../../api/ManageLots';
import { View } from 'react-native';
import ViewAll from '../../../components/ViewAll/ViewAll';
import { normalizeLots } from './utils';
import { BannerContext } from '../BannerContext';

const keys = {
  CreatedDate: 'createdDate',
  Id: 'id',
  Name: 'name',
  LastModifiedDate: 'lastModified',
  OCE__Lot__r: 'lot',
  OCE__Lot__c: 'lotId',
  OCE__LotExpirationDate__c: 'expirationDate',
  OCE__Product__c: 'productId',
  OCE__Product__r: 'product',
  OCE__IsActive__c: 'isActive',
};

const ManageLotsWidgetContainer = ({navigation}) => {
  const [lots, { handleFetch }] = useFetcher(fetchLots, normalizeLots(keys));
  const [banner, setBanner] = useContext(BannerContext);

  const handleStatusChange = async (status, id) => {
    try {
      await changeLotStatus(status, id);
      setBanner({
        variant: 'success',
        message: 'Success! Lot allocation status has been updated',
        visible: true,
        icon: 'checkbox-marked-circle',
      });
      await handleFetch();
    } catch (e) {
      setBanner({
        variant: 'error',
        message: e.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  useEffect(() => {
    const event = navigation.addListener('didFocus', () => {
      const refresh = navigation.getParam('refreshLotsWidget', false);

      if (refresh) handleFetch();
    });
    return () => event.remove();
  }, [navigation]);

  return (
    <Card>
      <Card.Title title="Manage Lots" />
      <Card.Content>
        {useHandleData(lots)(data => (
          <View>
            {data.map(item => (
              <LotItem
                key={item.id}
                item={item}
                handleStatusChange={handleStatusChange}
              />
            ))}
            {data.length ? (
              <ViewAll onPress={() => navigation.navigate('ManageLots')} />
            ) : (
              <Text>No active Lots available.</Text>
            )}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};
export default ManageLotsWidgetContainer;
