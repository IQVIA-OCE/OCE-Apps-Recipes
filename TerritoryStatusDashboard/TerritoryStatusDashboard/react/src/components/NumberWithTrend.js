import { useTheme } from 'apollo-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TRENDS } from '../constants';

export const NumberWithTrend = ({
  number,
  trend = TRENDS.NONE,
  style,
  ...props
}) => {
  const theme = useTheme();
  const trendsList = {
    [TRENDS.NONE]: {
      icon: undefined,
      color: theme.colors.text,
    },
    [TRENDS.GROWING]: {
      icon: 'arrow-up-bold',
      color: theme.colors.success,
    },
    [TRENDS.STABLE]: {
      icon: 'arrow-right-bold',
      color: theme.colors.warning,
    },
    [TRENDS.DOWNWARD]: {
      icon: 'arrow-down-bold',
      color: theme.colors.error,
    },
  };

  return (
    <View {...props} style={[styles.container, style]}>
      <Text style={[styles.number, { color: trendsList[trend].color }]}>{number}</Text>
      {trend !== TRENDS.NONE && (
        <Icon
          size={16}
          name={trendsList[trend].icon}
          color={trendsList[trend].color}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  number: {
    fontSize: 16,
    paddingLeft: 5,
    paddingRight: 5,
    fontWeight: 'bold',
  },
});
