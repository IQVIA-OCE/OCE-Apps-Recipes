import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'apollo-react-native';

const InfoField = ({ label, text, style }) => {
  return (
    <View style={[styles.root, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
  },
});

export default InfoField;
