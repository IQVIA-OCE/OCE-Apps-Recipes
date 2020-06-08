import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { inventoriesColors } from './constants';
import Status from '../../../../components/Status/Status';
import moment from 'moment';

const InventoriesListItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.icon,
            { backgroundColor: inventoriesColors[item.DeveloperName] },
          ]}
        >
          <Icon name="cube-outline" size={32} color={'#fff'}/>
        </View>
        <View>
          <Text style={styles.title}>{item.OCE__SampleInventoryDetails__r.totalSize} Product Sample Details</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Date: </Text>
            <Text style={styles.descriptionText}>{moment(item.OCE__InventoryDateTime__c).format('MMM d, YYYY hh:mm a')}</Text>
          </View>
        </View>
      </View>
      <View>
        <Status status={item.OCE__Status__c}/>
      </View>
    </View>
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

export default InventoriesListItem;
