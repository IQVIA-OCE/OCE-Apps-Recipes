import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Status from '../../../components/Status/Status';

const TitleCell = ({ row }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{row.label}</Text>
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
