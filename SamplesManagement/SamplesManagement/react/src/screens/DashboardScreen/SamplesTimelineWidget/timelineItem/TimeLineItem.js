import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { recordTypes } from './constants';
import moment from 'moment';
import Status from '../../../../components/Status/Status';

export default TimelineItemComponent = props => {
  const { item } = props;
  const { icon, color } = recordTypes[item.recordTypeDevName];

  const renderDetails = item => {
    let details;

    switch (item.recordTypeDevName) {
      case 'AcknowledgementOfShipment':
        details = renderAcknowledgementDetails(item);
        break;
      case 'Adjustment':
        details = renderAdjustmentDetails(item);
        break;
      case 'Disbursement':
        details = renderDisbursementDetails(item);
        break;
      case 'Order':
        details = renderOrderDetails(item);
        break;
      case 'TransferIn':
        details = renderTransferInDetails(item);
        break;
      case 'TransferOut':
        details = renderTransferOutDetails(item);
        break;
      case 'Return':
        details = renderReturnDetails(item);
        break;
      default:
        break;
    }
    return details;
  };

  //Order
  const renderOrderDetails = item => (
    <View>
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products ordered
          </Text>
        </View>
      ) : null}
      {item.isUrgent ? (
        <Status status={'Urgent'}/>
      ) : null}
    </View>
  );

  //TransferIn
  const renderTransferInDetails = item => (
    <View>
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            Received {item.detailsCount} Products
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Condition: </Text>
        <Text style={styles.detailsText}>{item.conditionOfPackage}</Text>
      </View>
    </View>
  );

  //TransferOut
  const renderTransferOutDetails = item => (
    <View>
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            Shipped {item.detailsCount} Products
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Shipment: </Text>
        <Text style={styles.detailsText}>
          {moment(item.shipmentDate).format('MMM D, YYYY')}
        </Text>
      </View>
    </View>
  );

  //AcknowledgementOfShipment
  const renderAcknowledgementDetails = item => (
    <View>
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products received
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Condition: </Text>
        <Text style={styles.detailsText}>{item.conditionOfPackage}</Text>
      </View>
    </View>
  );

  //Adjustment
  const renderAdjustmentDetails = item => (
    <View>
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products in Adjustment
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Rep: </Text>
        <Text style={styles.detailsText}>{item.transactionRepName}</Text>
      </View>
    </View>
  );

  //Disbursement
  const renderDisbursementDetails = item => (
    <View>
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Samples Dropped
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Global_Account: </Text>
        <Text style={styles.detailsText}>{item.accountName}</Text>
      </View>
    </View>
  );

  //Return
  const renderReturnDetails = item => (
    <View>
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products in Return
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.detailsTitle}>Return: </Text>
        <Text style={styles.detailsText}>{item.address}</Text>
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
          <View style={{ ...styles.line, backgroundColor: color }}/>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.recordTypeContainer}>
            <Text style={styles.recordNameText}>{item.recordTypeName}</Text>

            {item.recordTypeDevName === 'TransferIn' ||
            item.recordTypeDevName === 'TransferOut' ? (
              <View style={styles.transferContainer}>
                <Icon
                  style={styles.transferArrow}
                  name={
                    item.recordTypeDevName === 'TransferIn'
                      ? 'arrow-left'
                      : 'arrow-right'
                  }
                  size={14}
                  color="black"
                />
                <Text style={styles.recordNameText}>
                  {item.recordTypeDevName === 'TransferIn'
                    ? item.fromSalesRepName
                    : item.toSalesRepName}
                </Text>
              </View>
            ) : null}
          </View>
          {renderDetails(item)}
        </View>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.itemRelativeDateText}>
          {moment(item.lastModifiedDate).fromNow()}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Status status={item.status}/>
          <Icon name={'eye'} size={17} color="#595959" />
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
