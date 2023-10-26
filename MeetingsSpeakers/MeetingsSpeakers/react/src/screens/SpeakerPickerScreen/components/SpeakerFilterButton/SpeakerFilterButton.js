import React from 'react';
import { Button } from 'apollo-react-native';
import { StyleSheet } from 'react-native';
import { isIphone } from '../../../../utils';

export const SpeakerFilterButton = ({ onSetFilter, isDisabled, children, color, ...props }) => {
  return (
    <Button
      {...props}
      style={styles.filterButton}
      onPress={onSetFilter}
      mode="contained"
      size={isIphone ? 'small' : 'large'}
      disabled={isDisabled}
      color={color}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});
