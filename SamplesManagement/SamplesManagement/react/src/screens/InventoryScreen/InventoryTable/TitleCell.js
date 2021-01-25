import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Status from '../../../components/Status/Status';
import { externalNavigator } from '../../../../bridge/Navigation/ExternalNavigator';

const navigateToUrl = async url => {
  try {
    await externalNavigator.open(url);
  } catch (error) {
    console.error(error);
  }
};

const TitleCell = ({ row }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigateToUrl(
            `{EndPoint}&retURL=%2Flightning%2Fr%2FOCE__Product__c%2F${row.sampleProductId}%2Fview`
          )
        }
      >
        <Text style={styles.title}>{row.label}</Text>
      </TouchableOpacity>
      <Status status="Info" size="large" text={row.lotNumber} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  title: {
    marginBottom: 5,
    color: '#0070d2',
  },
});

export default TitleCell;
