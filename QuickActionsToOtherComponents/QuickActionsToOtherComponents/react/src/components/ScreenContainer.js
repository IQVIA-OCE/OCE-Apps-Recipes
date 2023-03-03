import { Text } from 'apollo-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_STATUS, PAGE } from '../constants';
import { CallScreen } from '../screens/CallScreen';
import { MeetingScreen } from '../screens/MeetingScreen';
import {
  loadingStatusSelector,
  pageSelector,
} from '../store/settings/settingsSelector';
import { identifyPage } from '../store/settings/settingsSlice';
import { CustomProgress } from './CustomProgress';

export const ScreenContainer = ({ recordId }) => {
  const dispatch = useDispatch();
  const page = useSelector(pageSelector);
  const isLoading =
    useSelector(loadingStatusSelector) === LOADING_STATUS.PENDING;

  useEffect(() => {
    dispatch(identifyPage(recordId));
  }, []);

  if (isLoading) {
    return <CustomProgress />;
  }

  if (page === PAGE.CALL) {
    return <CallScreen recordId={recordId} />;
  } else if (page === PAGE.MEETING) {
    return <MeetingScreen recordId={recordId} />;
  } else {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          The widget should be added to the Meeting or Call page.
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});
