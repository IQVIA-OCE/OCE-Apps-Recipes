import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { themeGrey, black } from 'apollo-react-native';
import { isIphone } from '../../../../utils';
import { localized } from '../../../../../bridge/Localization/localization.native';
import { useSelector } from 'react-redux';
import { LOADING_STATUS, LOCALIZATION_NAMESPACE } from '../../../../constants';
import { isInvitedSelector, loadingStatusSelector } from '../../../../store/speakerPicker/speakerPickerSelectors';
import { SpeakerSelectButton } from '../SpeakerSelectButton/SpeakerSelectButton';

export const SpeakerListItem = ({ speaker, onInvite }) => {
  const { id, name, specialty, professionalDesignation, status } = speaker;
  const isInvited = useSelector(isInvitedSelector(id));
  const loadingStatus = useSelector(loadingStatusSelector);
  const isSubmitting = loadingStatus === LOADING_STATUS.SUBMITTING;

  const speakerDetails = [specialty, professionalDesignation, status].filter(Boolean);

  const handleInvite = () => {
    onInvite(speaker);
  };

  const inviteButtonText = isInvited
    ? localized(`${LOCALIZATION_NAMESPACE}invited`, 'Invited')
    : localized(`${LOCALIZATION_NAMESPACE}invite`, 'Invite');

  return (
    <View style={styles.listItem}>
      <View style={{ flexShrink: 1 }}>
        <View>
          <Text style={styles.itemTitle} ellipsizeMode="tail" numberOfLines={1}>
            {name}
          </Text>
        </View>
        {Boolean(speakerDetails.length) && (
          <View style={styles.details}>
            {speakerDetails.map((field, fieldIdx) => (
              <Fragment key={fieldIdx}>
                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.detail} ellipsizeMode="tail" numberOfLines={1}>
                    {field}
                  </Text>
                </View>
                {fieldIdx < speakerDetails.length - 1 && (
                  <View testID="description-separator">
                    <Text style={styles.separator}>&#183;</Text>
                  </View>
                )}
              </Fragment>
            ))}
          </View>
        )}
      </View>
      <View>
        <SpeakerSelectButton
          handleSelect={handleInvite}
          buttonText={inviteButtonText}
          mobileButtonColor={isInvited ? 'green' : 'blue'}
          buttonColor={isInvited ? 'tertiary' : 'primary'}
          icon={isInvited ? 'check' : 'plus'}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: themeGrey[200],
    paddingVertical: 10,
  },
  itemTitle: {
    marginBottom: 5,
    color: black[300],
    fontWeight: 'bold',
    fontSize: isIphone ? 20 : 14,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  detail: {
    fontSize: isIphone ? 18 : 13,
    color: themeGrey[700],
  },
  separator: {
    fontSize: 20,
    marginLeft: 4,
    marginRight: 4,
    color: themeGrey[700],
  },
});
