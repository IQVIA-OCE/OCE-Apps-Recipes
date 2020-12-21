import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { black } from 'apollo-react-native';

const FormDetailsTitle = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f2f2",
    borderRadius: 4,
    paddingHorizontal: 10
  },
  title: {
    color: black[300],
    fontSize: 16,
    lineHeight: 30
  },
});

export default FormDetailsTitle;
