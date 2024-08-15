import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from '@oce-apps/apollo-react-native';
import { isIphone } from '../utils';

export const SelectButton = ({
  handleSelect,
  buttonText,
  mobileButtonColor,
  buttonColor,
  icon,
}) => {
  if (isIphone) {
    return (
      <IconButton
        icon={icon}
        color={mobileButtonColor}
        size={40}
        onPress={handleSelect}
        accessibilityLabel="select-icon-button"
      />
    );
  }
  return (
    <View style={styles.selectButton}>
      <Button
        mode="contained"
        color={buttonColor}
        icon={icon}
        onPress={handleSelect}
        testID="a-button"
      >
        {buttonText}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    width: 140,
  },
});
