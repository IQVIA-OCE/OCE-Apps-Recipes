import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'apollo-react-native';

const FormDetails = ({ title, children }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.tertiary }]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
  },
  title: {
    marginBottom: 5,
  },
});

export default FormDetails;
