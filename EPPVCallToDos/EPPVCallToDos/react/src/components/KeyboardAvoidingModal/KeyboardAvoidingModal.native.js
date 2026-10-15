import React, { memo, useEffect, useState } from 'react';
import { Modal, useTheme } from '@oce-apps/apollo-react-native';
import { Dimensions, View } from 'react-native';
import KeyboardSpacer from '../KeyboardSpacer/KeyboardSpacer';

const windowHeight = Dimensions.get('window').height;
const halfWindowHeight = windowHeight / 2;

export const KeyboardAvoidingModal = memo(({ additionalTopSpacing = 0, children, ...rest }) => {
  const [topSpacing, setTopSpacing] = useState(10);
  const [modalContentHeight, setModalContentHeight] = useState(0);
  const theme = useTheme();

  const onLayout = (e) => {
    const {
      nativeEvent: {
        layout: { height },
      },
    } = e;

    if (!modalContentHeight && modalContentHeight !== height) {
      setModalContentHeight(height);
    }
  };

  useEffect(() => {
    const newTopSpacing = -halfWindowHeight + modalContentHeight + additionalTopSpacing;

    setTopSpacing(newTopSpacing);
  }, [modalContentHeight, additionalTopSpacing]);

  const total = React.Children.count(children);
  const siblings = React.Children.map(children, (child) =>
    React.isValidElement(child) && child.type ? child.type.displayName : null
  );

  const _children = React.Children.map(children, (child, index) => {
    return React.isValidElement(child)
      ? React.cloneElement(child, {
          index,
          total,
          siblings,
          variant: rest.variant,
          theme,
          handleClose: rest.onDismiss,
        })
      : child;
  });

  return (
    <Modal {...rest} contentContainerStyle={{ backgroundColor: 'transparent' }}>
      <View onLayout={onLayout} style={{ backgroundColor: theme.colors.surface }}>
        {_children}
      </View>
      <KeyboardSpacer topSpacing={topSpacing} />
    </Modal>
  );
});
