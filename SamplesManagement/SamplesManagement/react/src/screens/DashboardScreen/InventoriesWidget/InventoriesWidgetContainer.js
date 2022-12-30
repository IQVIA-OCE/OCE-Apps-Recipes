import React from 'react';
import InventoriesWidget from './InventoriesWidget';
import { Card, ActivityIndicator, Text, useTheme } from 'apollo-react-native';
import { useFetcher } from '../../../hooks';
import { fetchInventoryTypes } from '../../../api/Inventories';
import { normalizeRecordTypes } from './utils';
import { View } from 'react-native';

const InventoriesWidgetContainer = ({ navigation }) => {
  const [recordTypes] = useFetcher(fetchInventoryTypes, normalizeRecordTypes);
  const theme = useTheme();

  if (recordTypes.loading)
    return (
      <Card>
        <Card.Title title="Inventories" />
        <Card.Content>
          <ActivityIndicator
            animating={true}
            color={theme.colors.primary}
            style={{ paddingVertical: 10 }}
          />
        </Card.Content>
      </Card>
    );

  if (recordTypes.error)
    return (
      <Card>
        <Card.Title title="Inventories" />
        <Card.Content>
          <View>
            <Text>
              {(recordTypes.error && recordTypes.error.message) ||
                recordTypes.error}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );

  return <InventoriesWidget recordTypes={recordTypes.data} navigation={navigation} />;
};

export default InventoriesWidgetContainer;
