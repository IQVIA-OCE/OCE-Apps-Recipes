import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { inventoriesColors } from '../constants';
import Status from '../../../../components/Status/Status';
import { getDate } from '../utils';
import { INVENTORY_FORM_TYPE } from '../../../../constants/Inventories';

const InventoriesListItem = ({ item, navigation }) => {
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
          <View>
            <Text style={styles.title}>
              {item.OCE__SampleInventoryDetails__r
                ? `${item.OCE__SampleInventoryDetails__r.totalSize} `
                : ''}
              Product Sample Details
            </Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Date: </Text>
              <Text style={styles.descriptionText}>
                {getDate(item.OCE__InventoryDateTime__c)}
              </Text>
              {item.OCE__Reason__c && (
                <>
                  <Text style={[styles.descriptionTitle, { marginLeft: 10 }]}>
                    Reason:{' '}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {item.OCE__Reason__c}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View>
          <Status status={item.OCE__Status__c} />
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
    alignItems: 'center',
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
  },
  descriptionTitle: {
    fontSize: 12,
    color: '#3e3e3c',
  },
  descriptionText: {
    fontSize: 12,
    color: '#080707',
  },
  title: {
    color: '#0070d2',
    fontSize: 13,
  },
});

export default withNavigation(InventoriesListItem);
