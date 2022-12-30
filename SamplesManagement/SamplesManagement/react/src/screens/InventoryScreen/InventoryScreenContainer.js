import React from 'react';
import { View, StyleSheet } from 'react-native';
import InventoryContext from './InventoryContext';
import InventoryScreenComponent from './InventoryScreenComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const InventoryScreenContainer = ({ navigation }) => {
  return (
    <InventoryContext>
      <KeyboardAwareScrollView
        scrollEnabled={true}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={10}
        contentContainerStyle={styles.root}
      >
        <InventoryScreenComponent navigation={navigation} />
      </KeyboardAwareScrollView>
    </InventoryContext>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    height: '100%',
  },
});

export default InventoryScreenContainer;
