import React from 'react';
import { Portal } from '@oce-apps/apollo-react-native';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

const ModalPortal = ({ children }) => {
  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>{children}</View>
      </KeyboardAvoidingView>
    </Portal>
  );
};

export default ModalPortal;
