import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { statusColors } from './constants';

const getStatusLabelStyles = status => (
  status ? statusColors[status.replace(/\s/g, '')] : null
);

const Status = ({ status, size, text }) => {
  const statusStyles = getStatusLabelStyles(status);
  const bgColor = statusStyles && statusStyles.color ? statusStyles.color : undefined;
  const textColor  = statusStyles && statusStyles.textColor ? statusStyles.textColor  : 'white';

  return (
    <View
      testID="Status"
      style={[
        styles.container,
        styles[size],
        {
          backgroundColor: bgColor,
          marginRight: 5,
        },
      ]}
    >
      <Text
        style={[
          styles.labelText,
          {
            color: textColor,
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
