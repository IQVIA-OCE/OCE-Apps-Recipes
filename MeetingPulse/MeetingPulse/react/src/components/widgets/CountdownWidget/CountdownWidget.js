import Card from '../../Card/Card';
import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Text } from 'apollo-react-native';

import { Countdown } from './components/Countdown/Countdown';
import { TimeAgo } from './components/Countdown/TimeAgo';
import { useInterval } from '../../../hooks/useInterval';
import { MEETING_STATE, MEETING_STATUS } from '../../../constants/meeting';
import { checkMeetingState } from '../../../utils/checkMeetingState';
import { useDispatch, useSelector } from 'react-redux';
import { meetingSelector } from '../../../store/meetingSlice/meetingSelectors';
import { fetchMeeting } from '../../../store/meetingSlice/meetingSlice';
import { formatDateInUserLocale } from '../../../utils/helpers';
import { SECOND } from '../../../constants/time';

const CancelledMeetingHint = () => (
  <View style={{ paddingVertical: 36, justifyContent: 'center', alignItems: 'center' }} testID="cancelled-hint">
    <Text style={{ fontSize: 22 }}>Your meeting has been Cancelled</Text>
  </View>
);

const ConflictHint = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 8 }} testID="conflict-hint">
    <Icon style={{ marginBottom: 8 }} size={22} name="alert" />
    <Text style={{ textAlign: 'center' }}>
      The current status and start/end dates conflict, please check your meeting.
    </Text>
  </View>
);

const InProgressMeetingTimer = ({ startDate, endDate }) => {
  return (
    <View testID="in-progress-timer">
      <TimeAgo
        title="In Progress"
        startDate={startDate}
        endDate={endDate}
        getSubtitle={({ timer }) => <Text>Ends in {timer}</Text>}
      />
    </View>
  );
};

const PostMeetingTimer = ({ endDate }) => {
  return (
    <View testID="post-meeting-timer">
      <TimeAgo title="Has Ended" startDate={endDate} getSubtitle={({ timer }) => <Text>Ended {timer} ago</Text>} />
    </View>
  );
};

export const CountdownWidget = () => {
  const [meetingState, setMeetingState] = useState(null);
  const dispatch = useDispatch();
  const meeting = useSelector(meetingSelector);
  const { status } = meeting;
  const startDate = new Date(meeting.startDate).getTime();
  const endDate = new Date(meeting.endDate).getTime();

  useEffect(() => {
    dispatch(fetchMeeting());
  }, [meetingState]);

  useInterval(() => {
    if (status === MEETING_STATUS.Cancelled) return;

    setMeetingState(checkMeetingState(status, startDate, endDate));
  }, SECOND);

  const renderTimer = () => {
    if (status === MEETING_STATUS.Cancelled) return <CancelledMeetingHint />;

    switch (meetingState) {
      case MEETING_STATE.NotStarted:
        return (
          <View testID="pre-meeting-timer">
            <Countdown endDate={startDate} />
          </View>
        );
      case MEETING_STATE.InProgress:
        return <InProgressMeetingTimer startDate={startDate} endDate={endDate} />;
      case MEETING_STATE.Ended:
        return <PostMeetingTimer endDate={endDate} />;
      case MEETING_STATE.Conflicting:
        return <ConflictHint />;
    }
  };

  const cardTitle = meetingState === MEETING_STATE.NotStarted ? 'Meeting Starts In' : 'Meeting';

  return (
    <Card icon="clock-outline" title={cardTitle}>
      <View>
        {renderTimer()}
        {meetingState === MEETING_STATE.NotStarted && (
          <Text style={styles.meetingDate}>Meeting start date: {formatDateInUserLocale(meeting.startDate)}</Text>
        )}
        {(meetingState === MEETING_STATE.InProgress || meetingState === MEETING_STATE.Ended) && (
          <Text style={styles.meetingDate}>Meeting end date: {formatDateInUserLocale(meeting.endDate)}</Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  meetingDate: {
    marginTop: 12,
  },
});
