import React from 'react';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Surface, Text, useTheme } from '@oce-apps/apollo-react-native';
import { View, StyleSheet } from 'react-native';

const Card = ({ icon, title, count, children, testID, style }) => {
  const theme = useTheme();

  return (
    <Surface level={1} style={[styles.container, style]}>
      <View style={[styles.row, styles.header]} testID={testID}>
        {icon && <Icon style={styles.icon} size={22} name={icon} color={theme.colors.text} />}
        {Boolean(title) && <Text style={styles.title}>{title}</Text>}
        {Boolean(count) && <Text style={styles.title}> ({count})</Text>}
      </View>
      {children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  title: {
    fontWeight: 'bold',
  },
});
export default Card;
