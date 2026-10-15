import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@oce-apps/apollo-react-native';
import { isIphone } from '../../utils';

export const Cell = ({
  label,
  value,
  data,
  style,
  labelStyle,
  valueStyle,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, { padding: isIphone ? 12: 24 }, style]} {...props}>
      {data.map(({ label, value }) => (
        <View key={label} style={{marginBottom: 10}}>
          <Text style={[styles.label, {fontSize: isIphone ? 12 : 14}, labelStyle]}>{label}</Text>
          <Text allowFontScaling style={{ ...styles.value, fontSize: isIphone ? 14 : 17, ...valueStyle }}>
            {value !== null && String(value).length ? value : '--'}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 17,
  },
});
