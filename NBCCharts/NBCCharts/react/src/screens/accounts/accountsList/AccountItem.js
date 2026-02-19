import React from "react";
import PropTypes from "prop-types";
import { Animated, Platform, StyleSheet, View } from 'react-native';
import {
  navigator,
  externalNavigator
} from '@oce-apps/oce-apps-bridges';
import { IconButton, Text, withTheme } from "@oce-apps/apollo-react-native";
import { isMobilePhone } from "../../../constants";

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

  showCustomerDetails = async (customerUid) => {
    try {
      await navigator.navigate({}, 'Account', customerUid, 'present', 'view');
    } catch (error) {
      console.log(error);
      alert(error.message || 'Something went wrong');
    }
  }

  logACall = async (id) => {
    try {
      if (Platform.OS === 'web') {
        await externalNavigator.open(`{EndPoint}&retURL=/lightning/o/OCE__Call__c/new?recordId=${id}`)
      } else {
        await navigator.navigate({ parentId: id }, 'OCE__Call__c', null, 'present', 'new');
      }
    } catch (error) {
      console.log(error);
      alert(error.message || 'Something went wrong');
    }
  }

  handleInfoIconPress = async ({ accountName, countryCode }) => {
    const { navigation } = this.props;

    const externalLink = `https://clinicaltrials.gov/ct2/results?cond=&term=${accountName}&cntry=${countryCode}&state=&city=&dist=&Search=Search`;

    if (Platform.OS === 'web') {
      await externalNavigator.open(externalLink);
    } else {
      navigation.push('AccountInfo', {
        externalLink,
      })
    }
  }

  render() {
    const { itemData, columns, theme } = this.props;
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
        backgroundColor: theme.dark ? theme.colors.surface : "#ffffff",
        borderRadius: 6,
        minHeight: 120,
        flexDirection: isMobilePhone ? 'column' : 'row',
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
        color: theme.dark ? theme.colors.text : "#999999",
        fontSize: 13,
        marginBottom: 8,
      },
      text: {
        color: theme.dark ? theme.colors.text : "#494949",
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
              onPress={() => this.handleInfoIconPress({ accountName: itemData.OCE__Account__r.Name, countryCode })}
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

export default withTheme(AccountItem);
