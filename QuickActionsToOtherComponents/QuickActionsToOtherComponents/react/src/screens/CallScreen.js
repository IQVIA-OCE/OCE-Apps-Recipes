import { Portal, useTheme } from '@oce-apps/apollo-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startObservingDB, stopObservingDB } from '../api/observers';
import { CustomProgress } from '../components/CustomProgress';
import { CustomTable } from '../components/CustomTable';
import { InquiryCreationForm } from '../components/InquiryCreationForm';
import { ModalSelector } from '../components/ModalSelector';
import { ENTITY, LOADING_STATUS, WEB_BANNER_WARNING } from '../constants';
import {
  callAttendeesSelector,
  callObjSelector,
  inquiriesSelector,
  inquiriesTotalSizeSelector,
  inquiryChannelsSelector,
  inquiryTypesSelector,
  loadingStatusSelector,
  ordersSelector,
  ordersTotalSizeSelector,
  permissionsSelector,
  storeCheckSelector,
  storeCheckTotalSizeSelector,
} from '../store/call/callSelector';
import {
  callBootstrap,
  createNewInquiry,
  fetchInquiries,
  fetchOrders,
  fetchStoreCheck,
  setCallPermissions,
} from '../store/call/callSlice';
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
import {
  INQUIRY_COLUMNS,
  ORDER_COLUMNS,
  STORE_CHECK_COLUMNS,
} from './tablesColumnsLists';

export const CallScreen = ({ recordId, ...props }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [listenerForObservation, setListenerForObservation] = useState(null);
  const [isInquiryCreateFormOpen, setIsInquiryCreateFormOpen] = useState(false);
  const [isCallAttendeesSelectorOpen, setIsCallAttendeesSelectorOpen] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const isLoading =
    useSelector(loadingStatusSelector) === LOADING_STATUS.PENDING;
  const isBootstrapping =
    useSelector(loadingStatusSelector) === LOADING_STATUS.BOOTSTRAPPING;
  const callObj = useSelector(callObjSelector);
  const callAttendees = useSelector(callAttendeesSelector);
  const ordersData = useSelector(ordersSelector);
  const inquiriesData = useSelector(inquiriesSelector);
  const storeCheckData = useSelector(storeCheckSelector);
  const ordersTotalSize = useSelector(ordersTotalSizeSelector);
  const inquiriesTotalSize = useSelector(inquiriesTotalSizeSelector);
  const storeCheckTotalSize = useSelector(storeCheckTotalSizeSelector);
  const permissions = useSelector(permissionsSelector);
  const inquiryTypesPicklist = useSelector(inquiryTypesSelector);
  const inquiryChannelsPicklist = useSelector(inquiryChannelsSelector);

  useEffect(() => {
    dispatch(callBootstrap(recordId));

    if (isIOS) {
      const listener = startObservingDB(
        [ENTITY.ORDER, ENTITY.INQUIRY, ENTITY.STORE_CHECK],
        (entity) => {
          switch (true) {
            case entity === ENTITY.ORDER:
              dispatch(fetchOrders());
              break;
            case entity === ENTITY.INQUIRY:
              dispatch(fetchInquiries());
              break;
            case entity === ENTITY.STORE_CHECK:
              dispatch(fetchStoreCheck());
              break;
          }
        },
        (error) => dispatch(showErrorNotification(error.message))
      );
      setListenerForObservation(listener);
    }

    return () => {
      if (isIOS) {
        stopObservingDB(
          [ENTITY.ORDER, ENTITY.INQUIRY, ENTITY.STORE_CHECK],
          listenerForObservation,
          (error) => dispatch(showErrorNotification(error.message))
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!isBootstrapping) {
      dispatch(fetchOrders());
      dispatch(fetchInquiries());
      if (isIOS) dispatch(fetchStoreCheck());
      dispatch(setCallPermissions());
    }
  }, [isBootstrapping]);

  const openOrderScreen = async () => {
    try {
      if (isWeb) {
        dispatch(showWarningNotification(WEB_BANNER_WARNING));

        await openWEBCreateScreen(
          {
            recordId: callObj.accountId,
            c__callId: callObj.id,
          },
          ENTITY.ORDER
        );
      } else {
        await openNativeCreateScreen(
          {
            accountId: callObj.accountId,
            callIdFromLAC: callObj.id,
          },
          ENTITY.ORDER
        );
      }
    } catch (error) {
      dispatch(showErrorNotification(error.message));
    }
  };

  const openInquiryScreen = () => {
    if (callAttendees.length) {
      setIsCallAttendeesSelectorOpen(true);
    } else {
      setSelectedAccount({
        label: callObj.account,
        value: callObj.accountId,
      });
      setIsInquiryCreateFormOpen(true);
    }
  };

  const cancelCallAttendeesSelector = () => {
    setIsCallAttendeesSelectorOpen(false);
  };

  const nextCallAttendeesSelector = (accountItem) => {
    setIsCallAttendeesSelectorOpen(false);
    setSelectedAccount(accountItem);
    setIsInquiryCreateFormOpen(true);
  };

  const cancelInquiryScreen = () => {
    setIsInquiryCreateFormOpen(false);
  };

  const saveNewInquiry = (obj) => {
    setIsInquiryCreateFormOpen(false);
    dispatch(createNewInquiry(obj));
    if (isWeb) dispatch(showWarningNotification(WEB_BANNER_WARNING));
  };

  const openStoreCheckScreen = async () => {
    try {
      await openNativeCreateScreen(
        {
          callId: callObj.id,
        },
        ENTITY.STORE_CHECK
      );
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
          title="Orders"
          totalSize={ordersTotalSize}
          columns={ORDER_COLUMNS}
          rows={ordersData}
          initialSortedColumn="date"
          initialSortOrder="descending"
          columnWidth={[150, 'auto', 'auto', 'auto', 'auto']}
          hidePagination={false}
          icon="truck-delivery"
          onPressButton={() => openOrderScreen()}
          disableButton={!permissions.canCreateOrder}
        />
        <CustomTable
          title="Inquiry"
          totalSize={inquiriesTotalSize}
          columns={INQUIRY_COLUMNS}
          rows={inquiriesData}
          initialSortedColumn="name"
          initialSortOrder="ascending"
          columnWidth={[150, 'auto', 'auto', 'auto', 'auto']}
          hidePagination={false}
          icon="file-document"
          onPressButton={() => openInquiryScreen()}
          disableButton={!permissions.canCreateInquiry}
        />
        {isIOS && (
          <CustomTable
            title="Store Check"
            totalSize={storeCheckTotalSize}
            columns={STORE_CHECK_COLUMNS}
            rows={storeCheckData}
            initialSortedColumn="name"
            initialSortOrder="ascending"
            columnWidth={[200, 'auto', 'auto']}
            hidePagination={true}
            icon="store"
            onPressButton={() => openStoreCheckScreen()}
            disableButton={
              !permissions.canCreateStoreCheck || storeCheckData.length > 0
            }
          />
        )}
      </ScrollView>
      {isCallAttendeesSelectorOpen && (
        <ModalSelector
          title="Call Attendee"
          placeholder="Select a Call Attendee..."
          visible={isCallAttendeesSelectorOpen}
          handleCancel={cancelCallAttendeesSelector}
          handleNext={nextCallAttendeesSelector}
          items={[
            {
              label: callObj.account,
              value: callObj.accountId,
            },
            ...callAttendees.map((el) => ({
              label: el.account,
              value: el.accountId,
            })),
          ]}
        />
      )}
      {isInquiryCreateFormOpen && (
        <InquiryCreationForm
          visible={isInquiryCreateFormOpen}
          handleSave={saveNewInquiry}
          handleCancel={cancelInquiryScreen}
          account={selectedAccount}
          accountsList={[
            {
              label: callObj.account,
              value: callObj.accountId,
            },
            ...callAttendees.map((el) => ({
              label: el.account,
              value: el.accountId,
            })),
          ]}
          call={{ id: callObj.id, name: callObj.name }}
          inquiryTypes={inquiryTypesPicklist}
          inquiryChannels={inquiryChannelsPicklist}
        />
      )}
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
