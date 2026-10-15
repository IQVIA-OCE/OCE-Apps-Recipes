import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@oce-apps/apollo-react-native';
import recordTypeIcons from './RecordTypeIcons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import color from 'color';

const defaultTextColor = '#080707';

const HistoryTimelineItem = ({ item }) => {
  const icon = recordTypeIcons[item.recordType.DeveloperName];
  const theme = useTheme();
  const textColor = theme.dark ? color(defaultTextColor).negate().hex() : defaultTextColor;

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <View style={styles.iconContainer}>
          <View style={{ ...styles.iconBg, backgroundColor: icon.color }}>
            <Icon name={icon.name} size={17} color="white" />
          </View>
          <View style={{ ...styles.line, backgroundColor: icon.color }} />
        </View>
        <View style={styles.detailsContainer}>
          <Text numberOfLines={1} style={[styles.recordNameText, { color: textColor }]}>
            {item.recordType.Name}
          </Text>
          <Text numberOfLines={2} style={[styles.productName, { color: textColor }]}>
            {item.productName}
          </Text>
          <Text style={styles.createdDate}>{item.transactionDateTime}</Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.lotId}>{item.lotNumber}</Text>
        <View
          style={{ borderRadius: 50, backgroundColor: '#f88962', padding: 2 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {item.quantity}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSide: {
    flexDirection: 'row',
    flexGrow: 1,
    flexBasis: 0,
  },
  iconContainer: {
    width: 24,
    marginRight: 12,
    alignItems: 'center',
  },
  iconBg: {
    padding: 3,
    borderRadius: 4,
    width: 24,
    height: 24,
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 2,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: 'grey',
  },
  recordNameText: {
    fontSize: 13,
    marginBottom: 5,
    fontWeight: '400',
  },
  productName: {
    fontSize: 13,
    marginBottom: 5,
    fontWeight: '400',
  },
  createdDate: {
    fontSize: 11,
    marginBottom: 24,
    fontWeight: '400',
    color: '#3e3e3c',
  },
  rightSide: {
    alignItems: 'flex-end',
    flexGrow: 1,
    flexBasis: 0,
  },
  lotId: {
    fontSize: 12,
    color: '#3e3e3c',
  },
});

export default HistoryTimelineItem;
