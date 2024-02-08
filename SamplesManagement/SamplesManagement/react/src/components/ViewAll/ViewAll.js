import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from '@oce-apps/apollo-react-native';
import { externalNavigator } from '@oce-apps/oce-apps-bridges';
import color from 'color';

const navigateToUrl = async (url) => {
  try {
    await externalNavigator.open(url);
  } catch (error) {
    console.error(error);
  }
};

const ViewAll = ({ url, onPress }) => {
  const theme = useTheme();

  const handlePress = () => {
    if (url) {
      navigateToUrl(url);
    } else if (typeof onPress === 'function') {
      onPress();
    }
  };

  const borderColor = theme.dark
    ? color(theme.colors.background).lighten(0.7).hex()
    : color(theme.colors.background).darken(0.1).hex();

  return (
    <View style={[styles.viewAll, { borderTopColor: borderColor }]}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
          View all
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  viewAll: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#dddbda',
    paddingTop: 10,
    marginTop: 5,
  },
  viewAllText: {
    fontSize: 13,
  },
});

export default ViewAll;
