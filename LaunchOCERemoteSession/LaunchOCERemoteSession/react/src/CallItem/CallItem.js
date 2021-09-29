import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'apollo-react-native';
import { NavigationActions } from '../../bridge/Navigation/NavigationActions';
import { navigator } from '../../bridge/Navigation/ScreenNavigator';
import { localized } from '../../bridge/Localization/localization.native';
import { NAMESPACE } from '../../App';
import { DateTime } from 'luxon';
import { ListItemType } from './../utils/constants';

const CallItem = ({ item, setErrorBanner, filterItemsById }) => {
  const {
    id,
    dateTime,
    endDateTime,
    accountName,
    location,
    endDateTimeFull,
    name,
    type,
    signature,
  } = item;

  const showItem = (id) => {
    const entity =
      type == ListItemType.Call
        ? `${NAMESPACE}Call__c`
        : `${NAMESPACE}Meeting__c`;

    const actions = NavigationActions.details({
      entity,
      id: id,
    });

    navigator.dispatch(actions).then(
      (r) => console.log(r),
      (e) =>
        setErrorBanner({
          isVisible: true,
          message: e,
        })
    );
  };

  const launchCall = (id, endDateTimeFull) => {
    const endTime = DateTime.fromISO(endDateTimeFull).toMillis();
    const currentTime = DateTime.local().toMillis();
    const expiredLinkText = {
      message: localized(`${NAMESPACE}linkexpired`, 'The link is expired'),
    };

    if (currentTime > endTime) {
      setErrorBanner({
        isVisible: true,
        message: expiredLinkText,
      });
      filterItemsById(id);
    } else {
      const callUrl = `oce://deeplink/modal/sobject-name/${NAMESPACE}Call__c/record-id/${id}/action/view?commands=launchcall`;
      const meetingUrl = `oce://deeplink/modal/sobject-name/${NAMESPACE}Meeting__c/record-id/${id}/action/view?commands=launchmeeting`;
      const url = type == ListItemType.Call ? callUrl : meetingUrl;
      navigator.openDeeplink(url).then(
        (r) => console.log(r),
        (e) =>
          setErrorBanner({
            isVisible: true,
            message: e,
          })
      );
    }
  };

  const isItemSyncedWithSf = id
    ? !id.includes('meeting__c') && !id.includes('call__c')
    : false;

  return (
    <TouchableOpacity
      onPress={() => showItem(id)}
      disabled={!isItemSyncedWithSf || (signature && signature.length > 0)}
    >
      <View style={styles.row}>
        <View
          style={{
            width: '70%',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <View>
            <Text style={{ fontWeight: '500', fontSize: 15 }}>
              {accountName}
            </Text>
            <Text style={styles.dateTime}>
              {dateTime} - {endDateTime}
            </Text>
            {location ? (
              <Text style={{ fontWeight: '500', fontSize: 12 }}>
                {location}
              </Text>
            ) : null}
            {!isItemSyncedWithSf ? (
              <Text style={{ fontWeight: '300', fontSize: 12 }}>
                {localized('sync_required', 'Synchronization Required')}
              </Text>
            ) : null}
            {signature && signature.length ? (
              <Text style={{ fontWeight: '300', fontSize: 12 }}>
                Signed Call
              </Text>
            ) : null}
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon={
              type == ListItemType.Call ? 'cellphone-wireless' : 'microphone'
            }
            size={30}
            style={{ width: 35, height: 40 }}
            onPress={() => {
              launchCall(id, endDateTimeFull);
            }}
            disabled={!isItemSyncedWithSf || (signature && signature.length > 0)}
          />
          <Text style={styles.launchText}>
            {type == ListItemType.Call
              ? localized(`${NAMESPACE}launchcall`, 'Launch Call')
              : localized(
                  `${NAMESPACE}launch_remote_meeting`,
                  'Launch Remote Meeting'
                )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dateTime: {
    fontSize: 13,
    color: '#666',
  },
  launchText: {
    fontSize: 10,
    width: 100,
    textAlign: 'center',
  },
});

export default CallItem;
