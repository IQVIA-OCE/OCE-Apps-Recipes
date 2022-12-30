import React from 'react';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Surface } from 'apollo-react-native';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ icon, title, count, error, children, testID, style }) => {
  return (
    <Surface level={1} style={[styles.container, style]}>
      <View style={[styles.row, styles.header]} testID={testID}>
        {icon && (
          <Icon style={styles.icon} size={22} name={icon} />
        )}
        {Boolean(title) && (
          <Text style={styles.title}>{title}</Text>
        )}
        {Boolean(count) && (
          <Text style={styles.title}> ({count})</Text>
        )}
      </View>
      {children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10
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
