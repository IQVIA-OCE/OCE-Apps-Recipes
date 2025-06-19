import { Text } from '@oce-apps/apollo-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '../store/notification/notificationSlice';
import { openNativeViewScreen } from '../utils';

export const ActionCell = ({ row, column, ...props }) => {
  const dispatch = useDispatch();

  const openViewRecordScreen = async () => {
    try {
      await openNativeViewScreen(row.sObject, row.id);
    } catch (error) {
      dispatch(showErrorNotification(error.message));
    }
  };

  return (
    <View {...props}>
      <TouchableOpacity onPress={openViewRecordScreen}>
        <Text style={styles.text}>{row[column.accessor]}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#0768FD',
  },
});
