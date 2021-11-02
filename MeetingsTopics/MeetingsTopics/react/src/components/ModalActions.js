import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'apollo-react-native';
import { NAMESPACE } from '../constants';
import { localized } from '../../bridge/Localization/localization.native';

export const ModalActions = ({ onSave, onCancel }) => {
  return (
    <View style={styles.root}>
      <Button mode="contained" onPress={onSave} color="ternary">
        {localized(`${NAMESPACE}save`, 'Save')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
