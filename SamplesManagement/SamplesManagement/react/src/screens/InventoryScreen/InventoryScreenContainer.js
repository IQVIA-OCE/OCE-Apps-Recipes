import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import InventoryContext from './InventoryContext';
import InventoryScreenComponent from './InventoryScreenComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@oce-apps/apollo-react-native';

const InventoryScreenContainer = ({ navigation }) => {
  const theme = useTheme();

  return (
    <InventoryContext>
      <KeyboardAwareScrollView
        scrollEnabled={true}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={10}
        contentContainerStyle={styles.root}
        style={{ backgroundColor: theme.colors.background }}
        bounces={false}
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
