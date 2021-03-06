import React from 'react';
import PropTypes from 'prop-types';

import { Animated, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from '../../../../bridge/Navigation/NavigationActions';
import { NEW_MODE } from '../../../../bridge/Navigation/NavigationModes';
import { navigator } from '../../../../bridge/Navigation/ScreenNavigator';
import { IconButton } from 'apollo-react-native';
import { isIphone } from '../../../constants';

const propTypes = {
  itemData: PropTypes.object,
  columns: PropTypes.array,
};

const defaultProps = {
  itemData: {},
  columns: [],
};

const resolveObjectPath = (path, obj) => {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : null;
  }, obj || self);
};

const ordinalNumber = n =>
  ['st', 'nd', 'rd'][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] || 'th';

class AccountItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 250,
      delay: this.props.index * 120,
      useNativeDriver: true,
    }).start();
  }

  showCustomerDetails(customerUid) {
    const actions = NavigationActions.details({ id: customerUid });

    navigator.dispatch(actions);
  }

  logACall(id) {
    const actions = NavigationActions.new({
      entity: 'OCE__Call__c',
      mode: NEW_MODE,
      parentID: id,
    });

    navigator.dispatch(actions).then(
      r => console.log(r),
      e => console.log(e)
    );
  }

  render() {
    const { itemData, columns, navigation } = this.props;
    const accountAddress =
      itemData.OCE__Account__r &&
      itemData.OCE__Account__r.OCE__PrimaryAccountAddress__r
        ? itemData.OCE__Account__r.OCE__PrimaryAccountAddress__r.OCE__Address__r
            .OCE__DisplayAddress__c
        : '';
    const countryCode = itemData.OCE__Account__r
      ? itemData.OCE__Account__r.OCE__CountryCode__c
      : '';

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 6,
        minHeight: 120,
        flexDirection: isIphone ? 'column' : 'row',
      },
      cell: {
        flex: 2,
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
      firstCell: {
        flex: 3,
      },
      title: {
        color: '#999999',
        fontSize: 13,
        marginBottom: 8,
      },
      text: {
        color: '#494949',
        fontSize: 14,
      },
      textCaption: {
        fontWeight: '500',
      },
      actions: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
      },
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: this.state.opacity,
          },
        ]}
      >
        <View style={styles.container}>
          <View style={[styles.cell, styles.firstCell]}>
            <Text style={[styles.title, styles.text, styles.textCaption]}>
              {itemData.OCE__Account__r ? itemData.OCE__Account__r.Name : ''}
            </Text>
            <Text style={styles.text}>{accountAddress}</Text>
          </View>
          {columns.map((col, i) => {
            return (
              <View style={styles.cell} key={i}>
                <Text style={styles.title}>{col.title}</Text>
                <Text style={styles.text}>
                  {col.type
                    ? resolveObjectPath(col.accessor, itemData) +
                      ordinalNumber(resolveObjectPath(col.accessor, itemData)) +
                      ''
                    : resolveObjectPath(col.accessor, itemData)}
                </Text>
              </View>
            );
          })}
          <View style={styles.actions}>
            <IconButton
              icon="information"
              color="#2bb3fe"
              size={25}
              animated
              onPress={() =>
                navigation.push('AccountInfo', {
                  accountName: itemData.OCE__Account__r.Name,
                  countryCode: countryCode,
                })
              }
            />
            <IconButton
              icon="account"
              color="#2bb3fe"
              size={25}
              animated
              onPress={() =>
                this.showCustomerDetails(itemData.OCE__Account__r.Id)
              }
            />
            <IconButton
              icon="phone"
              color="#2bb3fe"
              size={25}
              animated
              onPress={() => this.logACall(itemData.OCE__Account__r.Id)}
            />
          </View>
        </View>
      </Animated.View>
    );
  }
}

AccountItem.propTypes = propTypes;
AccountItem.defaultProps = defaultProps;

export default AccountItem;
