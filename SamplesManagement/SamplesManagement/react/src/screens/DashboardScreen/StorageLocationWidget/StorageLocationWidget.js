import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Text, themeGrey } from 'apollo-react-native';
import { environment } from 'oce-apps-bridges';
import { useFetcher, useHandleData } from '../../../hooks';
import { fetchDefaultLocation } from '../../../api/StorageLocation';
import {normalizeLocation} from "./utils";

const StorageLocationWidget = ({ navigation }) => {
  const userId = environment.userID();
  const [location, { handleFetch }] = useFetcher(
    async () => await fetchDefaultLocation(userId),
    normalizeLocation
  );

  useEffect(() => {
    const event = navigation.addListener('didFocus', () => {
      const refresh = navigation.getParam('refreshLocationWidget', false);
      if (refresh) handleFetch();
    });
    return () => event.remove();
  }, [navigation]);

  return (
    <Card>
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
    color: '#3e3e3c',
  },
  addressText: {
    color: '#080707',
    fontSize: 13,
  },
});

export default StorageLocationWidget;
