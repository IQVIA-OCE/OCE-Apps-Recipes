import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApolloProgress, Title, Tooltip } from 'apollo-react-native';
import {
  isSystemGeneratedFilterEnabledSelector,
  loadingStatusSelector,
  searchQuerySelector,
  speakersSelector,
  userPreferredCountriesSelector,
} from '../../store/speakerPicker/speakerPickerSelectors';
import { LOADING_STATUS, LOCALIZATION_NAMESPACE } from '../../constants';
import {
  bootstrap,
  fetchMoreSpeakers,
  fetchSpeakers,
  saveInvitedSpeakers,
  setSearchQuery,
  toggleInviteSpeaker,
  toggleSystemGeneratedFilter,
} from '../../store/speakerPicker/speakerPickerSlice';
import { SpeakerModalActions } from './components/SpeakerModalActions/SpeakerModalActions';
import { localized } from 'oce-apps-bridges';
import { SpeakerListItem } from './components/SpeakerListItem/SpeakerListItem';
import { SpeakerFilterButton } from './components/SpeakerFilterButton/SpeakerFilterButton';
import { SpeakerSearchInput } from './components/SpeakerSearchInput/SpeakerSearchInput';
import { ListEmptyComponent } from '../../components/ListEmptyComponent/ListEmptyComponent';

export const SpeakerPickerScreen = ({ parentId, recordTypeId }) => {
  const dispatch = useDispatch();
  const speakers = useSelector(speakersSelector);
  const loadingStatus = useSelector(loadingStatusSelector);
  const isSystemGeneratedFilterEnabled = useSelector(isSystemGeneratedFilterEnabledSelector);
  const userPreferredCountries = useSelector(userPreferredCountriesSelector);
  const searchQuery = useSelector(searchQuerySelector);
  const isLoading = loadingStatus === LOADING_STATUS.PENDING;
  const stopFetchMore = useRef(true);

  const isBootstrapping = loadingStatus === LOADING_STATUS.BOOTSTRAPPING;
  const isSubmitting = loadingStatus === LOADING_STATUS.SUBMITTING;

  const preferredCountriesString = userPreferredCountries.join(', ');
  const filterTooltipText = localized(
    `${LOCALIZATION_NAMESPACE}speakercountryfilterdescription`,
    'Speaker Country = "%1$@"'
  ).replace('%1$@', preferredCountriesString);

  useEffect(() => {
    dispatch(
      bootstrap({
        parentId,
        recordTypeId,
      })
    );
  }, []);

  useEffect(() => {
    if (!isBootstrapping) handleFetch();
  }, [searchQuery, isSystemGeneratedFilterEnabled, isBootstrapping]);

  const handleFetch = () => {
    dispatch(fetchSpeakers());
  };

  const handleFetchMore = () => {
    if (!stopFetchMore.current) {
      dispatch(fetchMoreSpeakers());
      stopFetchMore.current = true;
    }
  };

  const onInvite = speaker => {
    dispatch(
      toggleInviteSpeaker({
        speaker,
        speakerId: speaker.id,
      })
    );
  };

  const onSearch = value => {
    dispatch(setSearchQuery(value));
  };

  const onSetFilter = () => {
    dispatch(toggleSystemGeneratedFilter());
  };

  const onSaveInvitedSpeakers = () => {
    dispatch(saveInvitedSpeakers());
  };

  if (isBootstrapping || isSubmitting) {
    return (
      <View style={styles.bigLoaderWrap} testID="loader-wrap">
        <ApolloProgress />
      </View>
    );
  }

  return (
    <View>
      {isLoading && (
        <View style={styles.loader}>
          <ApolloProgress />
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <SpeakerModalActions onSave={onSaveInvitedSpeakers} />
        </View>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>{localized(`${LOCALIZATION_NAMESPACE}select_speakers`, 'Select Speakers')}</Title>
        </View>
        <View style={styles.searchContainer}>
          <SpeakerSearchInput isDisabled={isLoading} onSearch={onSearch} />
          <View style={styles.searchFilterContainer}>
            <SpeakerFilterButton
              isFilterSet={isSystemGeneratedFilterEnabled}
              onSetFilter={onSetFilter}
              isDisabled={isLoading}
              color={isSystemGeneratedFilterEnabled ? 'primary' : 'tertiary'}
            >
              {localized(`${LOCALIZATION_NAMESPACE}systemgeneratedfilter`, 'System Generated Filter')}
            </SpeakerFilterButton>
            <Tooltip title={filterTooltipText} placement="right" variant="dark" testID="sgf-tooltip" />
          </View>
        </View>
        <FlatList
          testID="speakers-list"
          data={speakers}
          renderItem={({ item }) => <SpeakerListItem speaker={item} onInvite={onInvite} />}
          keyExtractor={item => item.id}
          onEndReached={handleFetchMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={handleFetch}
          style={styles.list}
          onScrollBeginDrag={() => {
            stopFetchMore.current = false;
          }}
          ListEmptyComponent={
            <ListEmptyComponent
              loadingStatus={loadingStatus}
              data={speakers}
              text={localized(`${LOCALIZATION_NAMESPACE}no_results_found`, 'No active speakers found')}
            />
          }
          initialNumToRender={20}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bigLoaderWrap: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
  container: {
    padding: 15,
    flex: 1,
    flexBasis: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  filterButton: {
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 10,
  },

  searchFilterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    width: 400,
  },
  list: {
    padding: 10,
  },
  emptyList: {
    alignSelf: 'center',
    paddingTop: 100,
    height: '100%',
    alignItems: 'center',
  },
});
