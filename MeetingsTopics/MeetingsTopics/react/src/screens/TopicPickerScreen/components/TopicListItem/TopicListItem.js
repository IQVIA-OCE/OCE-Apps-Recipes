import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { neutral05 } from 'apollo-react-native';
import { SelectButton } from '../../../../components';
import { localized } from '../../../../../bridge/Localization/localization.native';
import { isIphone, formatDate } from '../../../../utils';
import { NAMESPACE } from '../../../../constants';
import { useSelector } from 'react-redux';
import { isSelectedSelector } from '../../../../store/topicPicker/topicPickerSelectors';

export const TopicListItem = ({ topic, onSelect }) => {
  const topicDetails = [
    topic.meetingRecordTypes ? topic.meetingRecordTypes : topic.meetingType,
    topic.status,
    formatDate(topic.startDate),
    formatDate(topic.endDate),
  ];
  const isSelected = useSelector(isSelectedSelector(topic.id));

  const checkNextValue = (index) => {
    const nextInd = ++index;

    return topicDetails.length > nextInd && topicDetails[nextInd];
  };

  const handleSelect = () => {
    onSelect(topic);
  };

  return (
    <View style={styles.listRow}>
      <View style={styles.rowContainer}>
        <Text style={styles.topicName}>{topic.name}</Text>

        {Boolean(topicDetails.length) && (
          <View style={styles.topicDetails}>
            {topicDetails.map((field, fieldIdx) => (
              <Fragment key={fieldIdx}>
                <View style={styles.detailsString}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.detailsText}
                  >
                    {field}
                  </Text>
                </View>
                {checkNextValue(fieldIdx) && (
                  <View testID="description-separator">
                    <Text style={styles.detailsText}> &#183; </Text>
                  </View>
                )}
              </Fragment>
            ))}
          </View>
        )}
      </View>

      <SelectButton
        handleSelect={handleSelect}
        buttonText={
          isSelected
            ? localized(`${NAMESPACE}selected`, 'Selected')
            : localized(`${NAMESPACE}select`, 'Select')
        }
        mobileButtonColor={isSelected ? 'green' : 'blue'}
        buttonColor={isSelected ? 'tertiary' : 'primary'}
        icon={isSelected ? 'check' : 'plus'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listRow: {
    flexDirection: 'row',
  },
  rowContainer: {
    flex: 1,
  },
  topicName: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: isIphone ? 20 : 14,
  },
  topicDetails: {
    flexDirection: 'row',
  },
  detailsString: {
    flexShrink: 1,
  },
  detailsText: {
    color: neutral05[500],
    fontSize: isIphone ? 18 : 13,
  },
});
