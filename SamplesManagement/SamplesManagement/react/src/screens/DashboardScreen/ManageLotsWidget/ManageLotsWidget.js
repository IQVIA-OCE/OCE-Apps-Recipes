import React, {useContext, useCallback} from 'react';
import { Card, Text } from '@oce-apps/apollo-react-native';
import LotItem from '../../../components/LotItem/LotItem';
import { useFetcher, useHandleData } from '../../../hooks';
import { fetchLots, changeLotStatus } from '../../../api/ManageLots';
import { View } from 'react-native';
import ViewAll from '../../../components/ViewAll/ViewAll';
import { normalizeLots } from './utils';
import { BannerContext } from '../BannerContext';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NAMESPACE } from '../../../constants/constants';

const keys = {
  CreatedDate: 'createdDate',
  Id: 'id',
  Name: 'name',
  LastModifiedDate: 'lastModified',
  [`${NAMESPACE}Lot__r`]: 'lot',
  [`${NAMESPACE}Lot__c`]: 'lotId',
  [`${NAMESPACE}LotExpirationDate__c`]: 'expirationDate',
  [`${NAMESPACE}Product__c`]: 'productId',
  [`${NAMESPACE}Product__r`]: 'product',
  [`${NAMESPACE}IsActive__c`]: 'isActive',
};

const ManageLotsWidgetContainer = () => {
  const [lots, { handleFetch }] = useFetcher(fetchLots, normalizeLots(keys));
  const [banner, setBanner] = useContext(BannerContext);
  const navigation = useNavigation();
  const route = useRoute();

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

  useFocusEffect(
    useCallback(() => {
      if (route.params && route.params.refreshLotsWidget) {
        handleFetch();
      }
      return () => {
        navigation.setParams({
          refreshLotsWidget: false,
        });
      };
    }, [route.params?.refreshLotsWidget])
  );

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
