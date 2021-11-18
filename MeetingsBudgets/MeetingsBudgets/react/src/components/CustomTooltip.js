import { IconButton, themePrimary } from 'apollo-react-native';
import TooltipContent from 'apollo-react-native/lib/module/components/Tooltip/TooltipContent';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const CustomTooltip = ({
  style,
  color,
  open,
  contentWidth,
  size = 20,
  timeout = 4000,
  icon = 'information',
  ...rest
}) => {
  const [opened, setOpened] = useState(open);
  const toggle = () => setOpened(!opened);

  useEffect(() => {
    let timer;
    if (timeout && opened) {
      timer = setTimeout(() => setOpened(false), timeout);
    }
    return () => timer && clearTimeout(timer);
  }, [opened]);

  return (
    <View style={[style, { flexDirection: 'row' }]} testID={'customTooltip'}>
      <TooltipContent
        {...rest}
        style={{ width: contentWidth || 'auto' }}
        opened={opened}
        onBackdropPress={toggle}
        TriggerComponent={() => (
          <IconButton
            {...rest}
            size={size}
            icon={icon}
            color={color || themePrimary[500]}
            onPress={toggle}
          />
        )}
      />
    </View>
  );
};

export default CustomTooltip;
