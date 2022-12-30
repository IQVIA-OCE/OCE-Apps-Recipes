import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_STATUS, NAMESPACE } from '../../constants';
import { Tooltip, ApolloProgress } from 'apollo-react-native';
import {
  loadingTopicStatusSelector,
  systemGeneratedFilterSelector,
} from '../../store/topicPicker/topicPickerSelectors';
import {
  bootstrap,
  saveSelectedTopics,
  setTopicSearchQuery,
  toggleSystemGeneratedFilter,
} from '../../store/topicPicker/topicPickerSlice';
import { localized } from 'oce-apps-bridges';
import { TopicsList } from './components/TopicsList/TopicsList';
import { ModalActions, SearchInput, FilterButton} from '../../components';

export const TopicPickerScreen = ({ parentId }) => {
  const dispatch = useDispatch();
  const loadingStatus = useSelector(loadingTopicStatusSelector);
  const isSystemGeneratedFilterEnabled = useSelector(systemGeneratedFilterSelector);

  const isLoading = loadingStatus === LOADING_STATUS.PENDING;
  const isBootstrapping = loadingStatus === LOADING_STATUS.BOOTSTRAPPING;
  const isSubmitting = loadingStatus === LOADING_STATUS.SUBMITTING;
  const isSaved = loadingStatus === LOADING_STATUS.SAVED;
  useEffect(() => {
    dispatch(
      bootstrap({ parentId })
    );
  }, []);

  const onSearch = (value) => {
    dispatch(setTopicSearchQuery(value));
  };

  const onSetFilter = () => {
    dispatch(toggleSystemGeneratedFilter());
  };

  const onSaveSelectedTopics = () => {
    dispatch(saveSelectedTopics());
  };

  return (
    <View style={styles.wrapper}>
      { isBootstrapping || isSubmitting ? (
        <View style={styles.loader} testID="loader-wrap">
          <ApolloProgress />
        </View>
      ) : (
        <View style={styles.container}>
          { (isSaved ) && <View style={styles.loader}/> }
          <ModalActions onSave={onSaveSelectedTopics} />

          <Text style={styles.headerText}>
            {localized(
              `${NAMESPACE}select_meeting_topic`,
              'Select Meeting Topic'
            )}
          </Text>

          <SearchInput isLoading={isLoading} onSearch={onSearch} />

          <View style={styles.filterContainer}>
            <FilterButton
              onSetFilter={onSetFilter}
              isDisabled={isLoading}
              color={isSystemGeneratedFilterEnabled ? 'primary' : 'tertiary'}
            >
              {localized(
                `${NAMESPACE}systemgeneratedfilter`,
                'System Generated Filter'
              )}
            </FilterButton>
            <Tooltip
              title={localized(
                `${NAMESPACE}oce__defaulttopicfilter`,
                `Default Topic Filter. When the filter is applied, only topics that are approved and applicable for the meeting type and are in effect on the start date of the meeting are listed.`
              )}
              placement="right"
              variant="light"
            />
          </View>

          <TopicsList />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  container: {
    padding: 15,
    flex: 1,
    flexBasis: '100%',
  },
  headerText: {
    marginVertical: 10,
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginBottom: 30,
  },
  filterButton: {
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 10,
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
