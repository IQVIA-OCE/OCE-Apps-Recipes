import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'apollo-react-native';

import { externalNavigator } from '../../../bridge/Navigation/ExternalNavigator';
import moment from 'moment';

const navigateToObj = id => {
  try {
    externalNavigator.open(
      `{EndPoint}&retURL=%2Fone%2Fone.app%3F%23%2FsObject%2F${id}%2Fview`
    );
  } catch (error) {
    console.error(error);
  }
};

const LotItem = ({ item, handleStatusChange, style }) => {
  const { lot, expirationDate } = item;
  const [isActive, setIsActive] = useState(item.isActive);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.icon, { backgroundColor: '#f2cf5b' }]}>
        <Icon name="briefcase" size={28} color={'#fff'} />
      </View>
      <View style={styles.content}>
        <View>
          {lot && lot.product && (
            <TouchableOpacity onPress={() => navigateToObj(lot.productId)}>
              <Text style={styles.title}>{lot.product.name}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.col}>
            <Text style={[styles.descriptionText, styles.descriptionTitle]}>
              Expiration:{' '}
            </Text>
            <Text style={[styles.descriptionText, styles.descriptionText]}>
              {expirationDate
                ? moment(expirationDate).format('MMM DD, YYYY')
                : ''}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={[styles.descriptionText, styles.descriptionTitle]}>
              Lot #:
            </Text>
            {lot && (
              <TouchableOpacity onPress={() => navigateToObj(item.lotId)}>
                <Text style={[styles.descriptionText, styles.descriptionLink]}>
                  {lot.name}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View>
        <Switch
          value={isActive}
          onChange={status => {
            setIsActive(!status);
            handleStatusChange(!status, item.id);
          }}
        />
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
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
    paddingTop: 2,
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginTop: 5,
    flexGrow: 1,
  },
  col: {
    flexDirection: 'row',
    width: '50%',
  },

  descriptionTitle: {
    color: '#3e3e3c',
  },
  descriptionText: {
    fontSize: 12,
    color: '#080707',
  },
  descriptionLink: {
    color: '#0070d2',
  },
  title: {
    color: '#0070d2',
    fontSize: 13,
  },
});

export default LotItem;
