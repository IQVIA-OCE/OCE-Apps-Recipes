import React, { memo } from 'react';
import { Modal } from 'apollo-react-native';

export const KeyboardAvoidingModal = memo(({ additionalTopSpacing = 0, children, ...rest }) => {
  return <Modal {...rest}>{children}</Modal>;
});
