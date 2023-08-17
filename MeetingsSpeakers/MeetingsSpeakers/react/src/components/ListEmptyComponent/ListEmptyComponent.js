import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'apollo-react-native';
import { LOADING_STATUS } from '../../constants';

export const ListEmptyComponent = ({ loadingStatus, data, text, ...props }) => {
  if (loadingStatus === LOADING_STATUS.SUCCESS && !data.length) {
    return (
      <View {...props} style={styles.emptyList}>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  emptyList: {
    alignSelf: 'center',
    paddingTop: 100,
    height: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
