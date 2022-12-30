import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
import { Provider as ApolloProvider } from 'apollo-react-native';
import store from './src/store/store';
import Dashboard from './src/components/Dashboard/Dashboard';
import { setMeetingId } from './src/store/meetingSlice/meetingSlice';
import { NotificationContainer } from './src/components/NotificationContainer/NotificationContainer';

Icon.loadFont();

const Root = ({ recordId }) => {
  const dispatch = useDispatch();

  const meetingId = useSelector(state => state.meeting.meetingId);

  useEffect(() => {
    if (recordId) {
      dispatch(setMeetingId(recordId));
    }
  }, []);

  return (
    <ApolloProvider>
      <NotificationContainer />
      {meetingId && <Dashboard />}
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

export default App;
