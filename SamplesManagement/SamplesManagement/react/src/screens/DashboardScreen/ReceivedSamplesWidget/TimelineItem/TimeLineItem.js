import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { recordTypes } from './constants';
import moment from 'moment';
import { IconButton } from 'apollo-react-native';

export default TimelineItemComponent = props => {
  const { item, navigation } = props;
  const { icon, color } = recordTypes[item.recordTypeDevName];

  const renderDetails = item => {
    let details;

    switch (item.recordTypeDevName) {
      case 'AcknowledgementOfShipment':
        details = renderAcknowledgementDetails(item);
        break;
      case 'TransferIn':
        details = renderTransferInDetails(item);
        break;
      default:
        break;
    }
    return details;
  };

  const showTransaction = (id, readonly) => {
    navigation.navigate('Transaction', {
      recordType: {
        DeveloperName: item.recordTypeDevName,
        Name: item.recordTypeName
      },
      readonly,
      id
    })
  }

  //TransferIn
  const renderTransferInDetails = item => (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
        <Text style={styles.detailsTitle}>Received: </Text>
        <Text style={styles.detailsText}>
          {item.receivedDate ? moment(item.receivedDate).fromNow() : ''}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Condition: </Text>
        <Text style={styles.detailsText}>{item.conditionOfPackage}</Text>
      </View>
    </View>
  );

  //AcknowledgementOfShipment
  const renderAcknowledgementDetails = item => (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
        <Text style={styles.detailsTitle}>Received: </Text>
        <Text style={styles.detailsText}>
          {item.receivedDate  ? moment(item.receivedDate).fromNow() : ''}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Condition: </Text>
        <Text style={styles.detailsText}>{item.conditionOfPackage}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <View style={styles.iconContainer}>
          <View style={{ ...styles.iconBg, backgroundColor: color }}>
            <Icon name={icon} size={17} color="white" />
          </View>
          <View style={{ ...styles.line, backgroundColor: color }} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.recordTypeContainer}>
            <Text style={styles.recordNameText}>{`${
              item.detailsCount ? item.detailsCount : '0'
            } Product samples ${
              item.recordTypeDevName == 'TransferIn'
                ? 'received'
                : 'to acknowledge'
            }`}</Text>
          </View>
          {renderDetails(item)}
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="eye"
            color={'#595959'}
            size={17}
            onPress={() => showTransaction(item.id, true)}
          />
          <IconButton
            icon="pencil"
            color={'#595959'}
            size={17}
            onPress={() => showTransaction(item.id, false)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  leftSide: {
    flexDirection: 'row',
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
  recordTypeContainer: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  recordNameText: {
    color: '#0070d2',
    fontSize: 13,
  },
  transferContainer: {
    flexDirection: 'row',
  },
  transferArrow: {
    marginHorizontal: 12,
  },
  detailsContainer: {
    paddingBottom: 24,
  },
  detailsCountContainer: {
    marginBottom: 3,
  },
  detailsText: {
    fontSize: 12,
    color: '#080707',
  },
  detailsTitle: {
    fontSize: 12,
    color: '#3e3e3c',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  itemRelativeDateText: {
    color: '#3e3e3c',
    fontSize: 12,
    marginBottom: 5,
  },
});
