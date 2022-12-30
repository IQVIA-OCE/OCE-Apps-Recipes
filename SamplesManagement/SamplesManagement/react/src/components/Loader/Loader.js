import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'apollo-react-native';

const Loader = () => {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator animating={true} color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    zIndex: 100,
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    opacity: 0.7,
  },
});

export default Loader;
