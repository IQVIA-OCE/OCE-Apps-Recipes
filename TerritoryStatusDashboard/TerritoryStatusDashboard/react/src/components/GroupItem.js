import { Text, Tooltip, useTheme } from 'apollo-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { isIphone, isWeb } from '../utils';
import { NumberWithTrend } from './NumberWithTrend';

const SMALL_TOOLTIP_MESSAGE_WIDTH = 200;
const ICON_WIDTH = 40;
const ROW_PADDING = 5;

export const GroupItem = ({
  item,
  style,
  ...props
}) => {
  const { name, tooltip, amount, trend, symbolAfter } = item;
  const theme = useTheme();
  const [widths, setWidths] = useState({
    row: 0,
    number: 0,
  });
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (widths.row !== 0 && widths.number !== 0) {
      setTextWidth(widths.row - widths.number - ICON_WIDTH - ROW_PADDING);
    }
  }, [widths]);

  const onLayoutHandler = (event, type) => {
    if (!isWeb) {
      event.persist();
    }
    setWidths((prevState) => ({
      ...prevState,
      [type]: event.nativeEvent.layout.width,
    }));
  };

  return (
    <View
      {...props}
      style={[styles.container, style]}
      onLayout={(event) => onLayoutHandler(event, 'row')}
    >
      <View style={styles.tooltipContainer}>
        <Tooltip
          placement="right"
          variant={theme.dark ? 'dark' : 'light'}
          size={18}
        >
          <View style={{ width: isIphone ? SMALL_TOOLTIP_MESSAGE_WIDTH : 'auto' }}>
            <Text>{tooltip}</Text>
          </View>
        </Tooltip>
        <Text numberOfLines={1} style={{ width: textWidth }}>{name}</Text>
      </View>
      <NumberWithTrend
        number={amount + (symbolAfter ?? '')}
        trend={trend}
        onLayout={(event) => onLayoutHandler(event, 'number')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: ROW_PADDING,
    width: '100%',
  },
  tooltipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
