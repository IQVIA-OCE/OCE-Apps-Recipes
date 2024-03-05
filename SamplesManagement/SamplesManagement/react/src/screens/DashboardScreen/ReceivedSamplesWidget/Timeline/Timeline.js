import React from 'react';
import { View } from 'react-native';
import TimelineItemComponent from '../TimelineItem/TimeLineItem';

const TimelineComponent = props => {
  const { items, navigation } = props;

  return (
    <View>
      {items.map(timelineItem => (
        <TimelineItemComponent key={timelineItem.id} item={timelineItem} navigation={navigation}/>
      ))}
    </View>
  );
};

export default TimelineComponent;
