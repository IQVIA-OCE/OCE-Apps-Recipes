import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LOADING_STATUS } from '../constants';
import { useTheme } from '@oce-apps/apollo-react-native';

export const ListEmptyComponent = ({ loadingStatus, data, text, ...props }) => {
  const theme = useTheme();

  if (loadingStatus === LOADING_STATUS.SUCCESS && !data.length) {
    return (
      <View {...props} style={styles.emptyList}>
        <Text style={{ fontSize: 20, color: theme.colors.text }}>{text}</Text>
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
