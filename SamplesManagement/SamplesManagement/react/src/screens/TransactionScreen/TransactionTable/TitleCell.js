import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@oce-apps/apollo-react-native';
import Status from '../../../components/Status/Status';

const TitleCell = ({ row }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{row.label}</Text>
      <Status status="Info" size="large" text={row.detailLabel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  title: {
    marginBottom: 5,
  }
});

export default TitleCell;
