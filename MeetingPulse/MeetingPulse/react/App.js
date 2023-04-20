import React, { useEffect, useState } from 'react';
import { NativeModules, Appearance, View,  StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
import { Provider as ApolloProvider, DefaultTheme, DarkTheme, utilityNegative, Text } from 'apollo-react-native';
import store from './src/store/store';
import Dashboard from './src/components/Dashboard/Dashboard';
import { setMeetingId } from './src/store/meetingSlice/meetingSlice';
import { NotificationContainer } from './src/components/NotificationContainer/NotificationContainer';
import { LOADING_STATUS } from './src/constants/loadingStatus';

Icon.loadFont();

const Root = ({ recordId }) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  let theme = DefaultTheme;

  const dispatch = useDispatch();

  const meetingId = useSelector((state) => state.meeting.meetingId);
  const meetingLoadingStatus = useSelector((state) => state.meeting.loadingStatus);
  const meetingError = useSelector((state) => state.meeting.error);

  if (colorScheme === 'dark') {
    theme = DarkTheme;
  }

  useEffect(() => {
    if (recordId) {
      dispatch(setMeetingId(recordId));
    }

    const themeListener = Appearance.addChangeListener(({ colorScheme }) =>
      setColorScheme(colorScheme === 'dark' ? 'dark' : 'light')
    );

    return () => {
      themeListener.remove();
    };
  }, []);

  const renderContent = () => {
    if (meetingLoadingStatus === LOADING_STATUS.FAILED || !meetingId) {
      return (
        <View style={styles.error} testID="inquiries-error">
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{meetingError || 'No provided metting Id'}</Text>
        </View>
      );
    }
    if (meetingId) {
      return <Dashboard />;
    }
  }

  return (
    <ApolloProvider theme={theme}>
      <NotificationContainer />
      {renderContent()}
    </ApolloProvider>
  );
};

const App = ({ recordId, instanceId }) => {
  if (instanceId) {
    const layout = NativeModules.LayoutBridge;
    layout.setHeight(600, instanceId);
  }
  return (
    <ReduxProvider store={store}>
      <Root recordId={recordId} />
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  notFound: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  notFoundText: {
    fontSize: 17,
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  errorText: {
    fontSize: 17,
    color: utilityNegative[500],
  },
});

export default App;
