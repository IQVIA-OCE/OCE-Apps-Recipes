import React, { memo } from 'react';
import { Modal } from '@oce-apps/apollo-react-native';

export const KeyboardAvoidingModal = memo(({ additionalTopSpacing = 0, children, ...rest }) => {
  return <Modal {...rest}>{children}</Modal>;
});
