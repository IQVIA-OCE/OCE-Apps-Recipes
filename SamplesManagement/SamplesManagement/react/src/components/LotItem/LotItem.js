import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch, Text, useTheme } from 'apollo-react-native';
import { externalNavigator } from 'oce-apps-bridges';
import moment from 'moment';
import color from 'color';

const navigateToObj = (id) => {
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

  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.icon, { backgroundColor: '#f2cf5b' }]}>
        <Icon name="briefcase" size={28} color={'#fff'} />
      </View>
      <View style={styles.content}>
        <View>
          {lot && lot.product && (
            <TouchableOpacity onPress={() => navigateToObj(lot.productId)} testID="navigateToProduct">
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                {lot.product.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.col}>
            <Text
              style={[
                styles.descriptionText,
                styles.descriptionTitle,
                { color: theme.colors.tertiary },
              ]}
            >
              Expiration:{' '}
            </Text>
            <Text style={[styles.descriptionText, styles.descriptionText]}>
              {expirationDate
                ? moment(expirationDate).format('MMM DD, YYYY')
                : ''}
            </Text>
          </View>
          <View style={styles.col}>
            <Text
              style={[
                styles.descriptionText,
                styles.descriptionTitle,
                { color: theme.colors.tertiary },
              ]}
            >
              Lot #:
            </Text>
            {lot && (
              <TouchableOpacity onPress={() => navigateToObj(item.lotId)} testID="navigateToLot">
                <Text
                  style={[
                    styles.descriptionText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {lot.name}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View>
        <Switch
          testID="statusChangeSwitch"
          value={isActive}
          onChange={(status) => {
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
  descriptionText: {
    fontSize: 12,
  },
  title: {
    fontSize: 13,
  },
});

export default LotItem;
