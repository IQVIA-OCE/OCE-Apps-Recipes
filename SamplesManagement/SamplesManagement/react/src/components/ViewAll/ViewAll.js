import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { externalNavigator } from '../../../bridge/Navigation/ExternalNavigator';

const navigateToUrl = async url => {
  try {
    await externalNavigator.open(url);
  } catch (error) {
    console.error(error);
  }
};

const ViewAll = ({ url, onPress }) => {
  const handlePress = () => {
    if (url) {
      navigateToUrl(url);
    } else if (typeof onPress === 'function') {
      onPress();
    }
  };
  return (
    <View style={styles.viewAll}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.viewAllText}>View all</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  viewAll: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#dddbda',
    paddingTop: 10,
    marginTop: 5,
  },
  viewAllText: {
    color: '#0070d2',
    fontSize: 13,
  },
});

export default ViewAll;
