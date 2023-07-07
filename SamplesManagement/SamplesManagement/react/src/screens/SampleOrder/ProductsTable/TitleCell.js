import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'apollo-react-native';

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
