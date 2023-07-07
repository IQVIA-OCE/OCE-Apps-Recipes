import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import { RadioButton, Text, useTheme } from 'apollo-react-native';
import { fetchTransactionRecordTypes } from '../../api/SampleTransaction';
import { useFetcher, useHandleData } from '../../hooks';
import { normalizeRecordTypes } from './utils';

const RecordTypeSelectorScreen = ({ navigation }) => {
  const [selectedRecordType, setSelected] = useState(null);
  const [recordTypes] = useFetcher(
    fetchTransactionRecordTypes,
    normalizeRecordTypes
  );

  const theme = useTheme();

  useEffect(() => {
    if (recordTypes.data && recordTypes.data.length) {
      setSelected(recordTypes.data[0]);
    }
  }, [recordTypes.data]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }} testID="RecordTypeSelectorScreen">
      <FormHeader
        iconColor="#34becd"
        label="New Sample Transaction"
        title="Select a record type"
        controls={[
          {
            label: 'Cancel',
            onPress: () => navigation.navigate('Dashboard'),
          },
          {
            label: 'Next',
            color: 'primary',
            mode: 'contained',
            disabled: recordTypes.loading,
            onPress: () =>
              navigation.navigate('Transaction', {
                recordType: selectedRecordType,
              }),
          },
        ]}
      />
      {useHandleData(recordTypes)((data) => (
        <View style={styles.radioGroupContainer}>
          <View>
            <RadioButton.Group
              onValueChange={(value) =>
                setSelected(() => data.find((rType) => rType.Id == value.Id))
              }
              value={selectedRecordType}
            >
              {data.map((recordType) => (
                <View key={recordType.Id}>
                  <RadioButton label={recordType.Name} value={recordType} />
                  <Text style={styles.recordTypeDescription}>
                    {recordType.Description}
                  </Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioGroupContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  recordTypeDescription: {
    marginLeft: 30,
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default RecordTypeSelectorScreen;
