import { Portal, useTheme } from '@oce-apps/apollo-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startObservingDB, stopObservingDB } from '../api/observers';
import { CustomProgress } from '../components/CustomProgress';
import { CustomTable } from '../components/CustomTable';
import { ModalSelector } from '../components/ModalSelector';
import { ENTITY, LOADING_STATUS, WEB_BANNER_WARNING } from '../constants';
import {
  callsSelector,
  callsTotalSizeSelector,
  loadingStatusSelector,
  meetingAttendeesSelector,
} from '../store/meeting/meetingSelector';
import {
  fetchCalls,
  fetchMeetingAttendees,
  meetingBootstrap,
} from '../store/meeting/meetingSlice';
import {
  showErrorNotification,
  showWarningNotification,
} from '../store/notification/notificationSlice';
import {
  isIOS,
  isIphone,
  isWeb,
  openNativeCreateScreen,
  openWEBCreateScreen,
} from '../utils';
import { CALL_COLUMNS } from './tablesColumnsLists';

export const MeetingScreen = ({ recordId, ...props }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listenerForObservation, setListenerForObservation] = useState(null);
  const isLoading =
    useSelector(loadingStatusSelector) === LOADING_STATUS.PENDING;
  const isBootstrapping =
    useSelector(loadingStatusSelector) === LOADING_STATUS.BOOTSTRAPPING;
  const callsData = useSelector(callsSelector);
  const meetingAttendeesData = useSelector(meetingAttendeesSelector);
  const callsTotalSize = useSelector(callsTotalSizeSelector);

  useEffect(() => {
    dispatch(meetingBootstrap(recordId));

    if (isIOS) {
      const listener = startObservingDB(
        [ENTITY.CALL],
        (entity) => {
          if (entity === ENTITY.CALL) {
            dispatch(fetchCalls());
          }
        },
        (error) => dispatch(showErrorNotification(error.message))
      );
      setListenerForObservation(listener);
    }

    return () => {
      if (isIOS) {
        stopObservingDB([ENTITY.CALL], listenerForObservation, (error) =>
          dispatch(showErrorNotification(error.message))
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!isBootstrapping) {
      dispatch(fetchCalls());
      dispatch(fetchMeetingAttendees());
    }
  }, [isBootstrapping]);

  const openCallScreen = () => {
    setIsModalOpen(true);
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };

  const nextModal = async (account) => {
    setIsModalOpen(false);

    try {
      if (isWeb) {
        dispatch(showWarningNotification(WEB_BANNER_WARNING));

        await openWEBCreateScreen(
          {
            recordId: account?.value || null,
          },
          ENTITY.CALL
        );
      } else {
        await openNativeCreateScreen(
          {
            accountId: account?.value || null,
          },
          ENTITY.CALL
        );
      }
    } catch (error) {
      dispatch(showErrorNotification(error.message));
    }
  };

  return (
    <View
      {...props}
      style={
        isWeb
          ? [styles.wrapperWeb, { backgroundColor: theme.colors.surface }]
          : [styles.wrapperIOS, { padding: isIphone ? 5 : 10 }]
      }
    >
      {(isLoading || isBootstrapping) && (
        <Portal>
          <CustomProgress />
        </Portal>
      )}
      <ScrollView style={styles.tablesContainer}>
        <CustomTable
          title="Call 2.0 calls"
          totalSize={callsTotalSize}
          columns={CALL_COLUMNS}
          rows={callsData}
          initialSortedColumn="dateTime"
          initialSortOrder="descending"
          columnWidth={[150, 'auto', 'auto', 'auto', 'auto']}
          hidePagination={false}
          onPressButton={() => openCallScreen()}
          icon="phone"
        />
      </ScrollView>
      <ModalSelector
        title="Meeting Attendee"
        placeholder="Select a Meeting Attendee..."
        visible={isModalOpen}
        handleCancel={cancelModal}
        handleNext={nextModal}
        items={meetingAttendeesData.map((el) => ({
          label: el.name,
          value: isWeb ? el.id : el.accountId,
        }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperIOS: {
    flex: 1,
  },
  wrapperWeb: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },
  tablesContainer: {
    flexDirection: 'column',
  },
});
