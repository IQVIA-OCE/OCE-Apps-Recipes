import { useTheme, neutral01 } from 'apollo-react-native';
import React from 'react';
import { View } from 'react-native';
import color from 'color';

const RowHeader = ({ children }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.dark
          ? color(theme.colors.surface).lighten(0.5).hex()
          : color(theme.colors.primary).lighten(0.93).hex(),
    }}
    >
      {children}
    </View>
  );
};

export default RowHeader;
