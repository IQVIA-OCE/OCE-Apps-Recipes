import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { recordTypes } from './constants';
import moment from 'moment';
import Status from '../../../../components/Status/Status';
import { IconButton, Text, useTheme } from 'apollo-react-native';

const TimelineItemComponent = (props) => {
  const { item, navigation } = props;
  const { icon, color } = recordTypes[item.recordTypeDevName];

  const theme = useTheme();

  const renderDetails = (item) => {
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

  const showItemDetails = (item) => {
    const readonly = true;
    const screenName =
      item.recordTypeDevName == 'Order' ? 'SampleOrder' : 'Transaction';

    navigation.navigate(screenName, {
      recordType: {
        DeveloperName: item.recordTypeDevName,
        Name: item.recordTypeName,
      },
      readonly,
      id: item.id,
    });
  };

  //Order
  const renderOrderDetails = (item) => (
    <View testID="OrderDetails">
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products ordered
          </Text>
        </View>
      ) : null}
      {item.isUrgent ? <Status status={'Urgent'} /> : null}
    </View>
  );

  //TransferIn
  const renderTransferInDetails = (item) => (
    <View testID="TransferInDetails">
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            Received {item.detailsCount} Products
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.detailsTitle, { color: theme.colors.tertiary }]}>
          Condition:{' '}
        </Text>
        <Text style={styles.detailsText}>{item.conditionOfPackage}</Text>
      </View>
    </View>
  );

  //TransferOut
  const renderTransferOutDetails = (item) => (
    <View testID="TransferOutDetails">
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            Shipped {item.detailsCount} Products
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.detailsTitle, { color: theme.colors.tertiary }]}>
          Shipment:{' '}
        </Text>
        <Text style={styles.detailsText}>
          {moment(item.shipmentDate).format('MMM D, YYYY')}
        </Text>
      </View>
    </View>
  );

  //AcknowledgementOfShipment
  const renderAcknowledgementDetails = (item) => (
    <View testID="AcknowledgementOfShipmentDetails">
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products received
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.detailsTitle, { color: theme.colors.tertiary }]}>
          Condition:{' '}
        </Text>
        <Text style={styles.detailsText}>{item.conditionOfPackage}</Text>
      </View>
    </View>
  );

  //Adjustment
  const renderAdjustmentDetails = (item) => (
    <View testID="AdjustmentDetails">
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products in Adjustment
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.detailsTitle, { color: theme.colors.tertiary }]}>
          Rep:{' '}
        </Text>
        <Text style={styles.detailsText}>{item.transactionRepName}</Text>
      </View>
    </View>
  );

  //Disbursement
  const renderDisbursementDetails = (item) => (
    <View testID="DisbursementDetails">
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Samples Dropped
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.detailsTitle, { color: theme.colors.tertiary }]}>
          Account:{' '}
        </Text>
        <Text style={{ ...styles.detailsText }}>{item.accountName}</Text>
      </View>
    </View>
  );

  //Return
  const renderReturnDetails = (item) => (
    <View testID="ReturnDetails">
      {item.detailsCount > 0 ? (
        <View style={styles.detailsCountContainer}>
          <Text style={styles.detailsText}>
            {item.detailsCount} Products in Return
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.detailsTitle, { color: theme.colors.tertiary }]}>
          Return:{' '}
        </Text>
        <Text style={styles.detailsText}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBg, { backgroundColor: color }]}>
            <Icon name={icon} size={17} color="white" />
          </View>
          <View style={[styles.line, { backgroundColor: color }]} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.recordTypeContainer}>
            <Text
              style={[styles.recordNameText, { color: theme.colors.primary }]}
            >
              {item.recordTypeName}
            </Text>

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
                  color={theme.colors.text}
                />
                <Text
                  style={[
                    styles.recordNameText,
                    { color: theme.colors.primary },
                  ]}
                >
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
        <Text
          style={[
            styles.itemRelativeDateText,
            { color: theme.colors.tertiary },
          ]}
        >
          {moment(item.lastModifiedDate).fromNow()}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Status status={item.status} />
          </View>
          <View>
            <IconButton
              icon="eye"
              color={theme.colors.tertiary}
              size={17}
              onPress={() => showItemDetails(item)}
            />
          </View>
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
  },
  detailsTitle: {
    fontSize: 12,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  itemRelativeDateText: {
    fontSize: 12,
    marginBottom: 5,
  },
});

export default TimelineItemComponent;