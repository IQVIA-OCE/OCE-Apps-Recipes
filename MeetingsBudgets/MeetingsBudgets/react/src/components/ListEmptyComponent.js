import { Text } from '@oce-apps/apollo-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LOADING_STATUS } from '../constants';

export const ListEmptyComponent = ({ loadingStatus, data, text, ...props }) => {
  if (loadingStatus === LOADING_STATUS.SUCCESS && !data.length) {
    return (
      <View {...props} style={styles.emptyList}>
        <Text style={{ fontSize: 20 }}>{text}</Text>
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
});
