import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'apollo-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { inventoriesColors } from '../constants';
import Status from '../../../../components/Status/Status';
import { getDate } from '../utils';
import { INVENTORY_FORM_TYPE } from '../../../../constants/Inventories';
import { useNavigation } from '@react-navigation/native';
import { NAMESPACE } from '../../../../constants/constants';

const InventoriesListItem = ({ item }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Inventory', {
          id: item.Id,
          type: INVENTORY_FORM_TYPE.preview,
        });
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={[
              styles.icon,
              { backgroundColor: inventoriesColors[item.DeveloperName] },
            ]}
          >
            <Icon name="cube-outline" size={32} color={'#fff'} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {item[`${NAMESPACE}SampleInventoryDetails__r`]
                ? `${item[`${NAMESPACE}SampleInventoryDetails__r`].totalSize} `
                : ''}
              Product Sample Details
            </Text>
            <View style={styles.descriptionContainer}>
              <Text style={[styles.descriptionTitle, { color: theme.colors.tertiary }]}>Date: </Text>
              <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
                {getDate(item[`${NAMESPACE}InventoryDateTime__c`])}
              </Text>
              {item[`${NAMESPACE}Reason__c`] && (
                <>
                  <Text style={[styles.descriptionTitle, { marginLeft: 10, color: theme.colors.tertiary }]}>
                    Reason:{' '}
                  </Text>
                  <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
                    {item[`${NAMESPACE}Reason__c`]}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View>
          <Status status={item[`${NAMESPACE}Status__c`]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  descriptionTitle: {
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 12,
  },
  title: {
    fontSize: 13,
  },
});

export default InventoriesListItem;
