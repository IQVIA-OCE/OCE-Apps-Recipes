import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Text, themeGrey } from '@oce-apps/apollo-react-native';
import { environment } from '@oce-apps/oce-apps-bridges';
import { useFetcher, useHandleData } from '../../../hooks';
import { fetchDefaultLocation } from '../../../api/StorageLocation';
import {normalizeLocation} from "./utils";
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

const StorageLocationWidget = () => {
  const userId = environment.userID();
  const [location, { handleFetch }] = useFetcher(
    async () => await fetchDefaultLocation(userId),
    normalizeLocation
  );

  const navigation = useNavigation();
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      if (route.params && route.params.refreshLocationWidget) {
        handleFetch();
      }
      return () => {
        navigation.setParams({
          refreshLocationWidget: false,
        });
      };
    }, [route.params?.refreshLocationWidget])
  );

  return (
    <Card testID="StorageLocationWidget">
      <Card.Title
        title="Samples Storage Location"
        right={() => (
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => {
              navigation.navigate('StorageLocationList');
            }}
            color={themeGrey[700]}
          />
        )}
      />
      <Card.Content>
        {useHandleData(location)(data => (
          <View>
            <Text style={styles.addressTitleText}>Address:</Text>
            <Text style={styles.addressText}>{data}</Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  addressTitleText: {
    fontSize: 12,
    fontWeight: '400',
  },
  addressText: {
    fontSize: 13,
  },
});

export default StorageLocationWidget;
