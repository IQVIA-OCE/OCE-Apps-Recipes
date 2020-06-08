import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, ActivityIndicator } from 'apollo-react-native';

const Loader = ({}) => {
  return (
    <View style={styles.root}>
      <ActivityIndicator animating={true} color={Colors.blue500} />
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
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});

export default Loader;
