import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../Card/Card';
import { Accordion } from '@oce-apps/apollo-react-native';
import AttendeeListItem from './components/AttendeeListItem/AttendeeListItem';
import { fetchAttendeesList } from '../../../store/attendeesSlice/attendeesSlice';
import { attendeesCountSelector, attendeesListSelector } from '../../../store/attendeesSlice/attendeesSelectors';
import { isMobilePhone, stringToHslColor } from '../../../utils/helpers';

const ATTENDEES_RECORD_TYPE_NAMES = {
  COLLEAGUE: 'Colleague',
};

const ATTENDEES_GROUPS_NAMES = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  other: 'Other',
};

const AttendeesWidget = () => {
  const attendeesList = useSelector(attendeesListSelector);
  const attendeesCount = useSelector(attendeesCountSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAttendeesList());
  }, []);

  const renderListItems = (list) =>
    list.map((attendee) => {
      const nameArr = attendee.name.split(' ');
      const initials = nameArr[0][0] + nameArr[nameArr.length - 1][0];
      const avatarColor = stringToHslColor(attendee.name, 30, 50);
      const name = `${attendee.name}${attendee.isCurrentUser ? ' (You)' : ''}`;
      const subtitle =
        attendee.recordTypeName === ATTENDEES_RECORD_TYPE_NAMES.COLLEAGUE ? attendee.type : attendee.recordTypeName;

      return (
        <AttendeeListItem
          key={attendee.id}
          title={name}
          subtitle={subtitle}
          avatarText={initials}
          avatarColor={avatarColor}
          email={attendee.email}
        />
      );
    });

  const renderAttendeesGroups = () => {
    return Object.keys(attendeesList).map((key, i) => {
      const count = attendeesList[key].length;
      const isExpanded = i === 0;
      const isDisabled = count === 0;

      return (
        <Accordion defaultExpanded={isExpanded} disabled={isDisabled} key={key}>
          <Accordion.Summary title={`${ATTENDEES_GROUPS_NAMES[key]} (${count})`} />
          <Accordion.Details>{renderListItems(attendeesList[key])}</Accordion.Details>
        </Accordion>
      );
    });
  };

  return (
    <Card
      icon="account-group"
      title="Attendees"
      count={attendeesCount}
      testID="Attendees_widget"
      style={{ height: isMobilePhone ? 'auto' : 540 }}
    >
      <ScrollView style={{ width: '100%', height: 300 }} nestedScrollEnabled={true}>
        <View>{Boolean(attendeesCount) && renderAttendeesGroups()}</View>
      </ScrollView>
    </Card>
  );
};

export default AttendeesWidget;
