import React, { useEffect, useRef } from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from 'apollo-react-native';
import { LOADING_STATUS, NAMESPACE } from '../../../../constants';
import {
  fetchTopics,
  fetchMoreTopics,
  toggleSelectTopic,
} from '../../../../store/topicPicker/topicPickerSlice';
import {
  loadingTopicStatusSelector,
  searchTopicQuerySelector,
  systemGeneratedFilterSelector,
  topicsSelector,
} from '../../../../store/topicPicker/topicPickerSelectors';
import { TopicListItem } from '../TopicListItem/TopicListItem';
import { ListEmptyComponent } from '../../../../components';
import { localized } from '../../../../../bridge/Localization/localization';

export const TopicsList = () => {
  const dispatch = useDispatch();
  const topics = useSelector(topicsSelector);
  const loadingStatus = useSelector(loadingTopicStatusSelector);
  const isSystemGeneratedFilterEnabled = useSelector(systemGeneratedFilterSelector);
  const searchQuery = useSelector(searchTopicQuerySelector);

  const isLoading = loadingStatus === LOADING_STATUS.PENDING;
  const stopFetchMore = useRef(true);

  useEffect(() => {
    handleFetch();
  }, [searchQuery, isSystemGeneratedFilterEnabled]);

  const handleFetch = () => {
    dispatch(fetchTopics());
  };

  const handleFetchMore = () => {
    if (!stopFetchMore.current) {
      dispatch(fetchMoreTopics());
      stopFetchMore.current = true;
    }
  };

  const onSelect = (topic) => {
    dispatch(
      toggleSelectTopic({
        topic,
        topicId: topic.id,
      })
    );
  };

  return (
   <FlatList
      testID="topics-list"
      data={topics}
      renderItem={({ item }) => (
        <View>
          <TopicListItem topic={item} onSelect={onSelect} />
          <Divider style={styles.divider} />
        </View>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={handleFetchMore}
      onEndReachedThreshold={0.5}
      refreshing={isLoading}
      onRefresh={handleFetch}
      onScrollBeginDrag={() => {
        stopFetchMore.current = false;
      }}
      ListEmptyComponent={
        <ListEmptyComponent
          loadingStatus={loadingStatus}
          data={topics}
          text={localized(
            `${NAMESPACE}no_results_found`,
            'No available topics found'
          )}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: 10,
    padding: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
});
