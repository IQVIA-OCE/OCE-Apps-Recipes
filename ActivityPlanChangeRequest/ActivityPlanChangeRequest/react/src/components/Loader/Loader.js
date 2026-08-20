import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ApolloProgress } from '@oce-apps/apollo-react-native';
import { useSelector } from 'react-redux';
import { loadingStatusSelector } from '../../store/applicationSlice/applicationSelectors';
import { LOADING_STATUS } from '../../constants/loadingStatus';

const Loader = () => {
  const loadingStatus = useSelector(loadingStatusSelector)

  if (loadingStatus === LOADING_STATUS.PENDING) {
    return (
      <View style={styles.container} testID="loader">
        <ApolloProgress />
      </View>
    )
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  }
})
export default Loader;
