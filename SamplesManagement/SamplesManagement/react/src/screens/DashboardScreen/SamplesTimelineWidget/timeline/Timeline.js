import React from 'react';
import { View } from 'react-native';
import TimelineItemComponent from '../timelineItem/TimeLineItem';

export default TimelineComponent = props => {
  const { items } = props;

  return (
    <View>
      {items.map(timelineItem => (
        <TimelineItemComponent key={timelineItem.id} item={timelineItem} />
      ))}
    </View>
  );
};
