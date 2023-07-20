import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from 'apollo-react-native';
import { isIphone } from '../../../../utils';

export const SpeakerSelectButton = ({
  handleSelect,
  buttonText,
  mobileButtonColor,
  buttonColor,
  icon,
  disabled = false,
}) => {
  if (isIphone) {
    return (
      <IconButton
        icon={icon}
        color={mobileButtonColor}
        size={40}
        onPress={handleSelect}
        accessibilityLabel="select-icon-button"
        disabled={disabled}
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
        disabled={disabled}
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
