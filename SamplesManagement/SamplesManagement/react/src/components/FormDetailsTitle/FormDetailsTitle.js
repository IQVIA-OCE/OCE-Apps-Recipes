import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text } from '@oce-apps/apollo-react-native';
import color from 'color';

const FormDetailsTitle = ({ title, children }) => {
  const theme = useTheme();

  const containerBgColor = color(theme.colors.surface)
    .darken(theme.dark ? 0.64 : 0.05)
    .hex()

  return (
    <View style={[styles.container, { backgroundColor: containerBgColor }]}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: 30,
  },
});

export default FormDetailsTitle;
