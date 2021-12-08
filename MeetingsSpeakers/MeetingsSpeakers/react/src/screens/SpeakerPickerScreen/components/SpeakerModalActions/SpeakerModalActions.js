import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'apollo-react-native';
import { LOCALIZATION_NAMESPACE } from '../../../../constants';
import { localized } from '../../../../../bridge/Localization/localization';

export const SpeakerModalActions = ({ onSave }) => {
  return (
    <View style={styles.root}>
      <Button mode="contained" onPress={onSave} color="ternary">
        {localized(`${LOCALIZATION_NAMESPACE}save`, 'Save')}
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
