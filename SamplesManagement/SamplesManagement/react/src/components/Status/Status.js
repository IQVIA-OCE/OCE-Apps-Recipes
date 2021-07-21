import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { statusColors } from './constants';

const getStatusLabelStyles = status => {
  return status ? statusColors[status.replace(' ', '')] : '';
};

const Status = ({ status, size, text }) => {
  return (
    <View
      style={[
        styles.container,
        styles[size],
        {
          backgroundColor: getStatusLabelStyles(status).color,
          marginRight: 5,
        },
      ]}
    >
      <Text
        style={[
          styles.labelText,
          {
            color: getStatusLabelStyles(status).textColor
              ? getStatusLabelStyles(status).textColor
              : 'white',
          },
        ]}
      >
        {text ? text : status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  large: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 15,
  },
});

export default Status;
