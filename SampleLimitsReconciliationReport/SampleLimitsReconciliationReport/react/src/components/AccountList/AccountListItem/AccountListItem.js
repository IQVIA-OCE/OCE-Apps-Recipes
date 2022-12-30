import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { setCallActivityData } from '../../../store/ReconciliationReport/ReconciliationReportSlice';
import { useDispatch } from 'react-redux';
import { mapJsonTemplate } from '../../../utils';
import { themePrimary, secondaryOrange } from 'apollo-react-native';
import { RulesListItem } from '../../RulesListItem/RulesListItem';

export const AccountListItem = ({ data, navigation }) => {
  const dispatch = useDispatch();
  const {
    id,
    accountName,
    accountSpecialty,
    limitTemplateName,
    sampleId,
    sampleName,
    sampleQuantity,
    limitJsonTemplate,
    errorMessage,
  } = data;
  const tableDate = [
    accountName,
    accountSpecialty,
    sampleName,
    limitTemplateName,
    sampleQuantity,
    '',
    '',
  ];

  const parseTemplateRules = mapJsonTemplate(limitJsonTemplate, sampleId);

  const onShowActivity = () => {
    navigation.navigate('ReportActivitiesScreen', {
      account: data,
      navigation: navigation,
    });
    dispatch(setCallActivityData(id));
  };

  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={() => onShowActivity()}>
        {Object.values(tableDate).map((field, key) => (
          <View key={key} style={styles.cell}>
            <Text numberOfLines={2}>{field}</Text>
          </View>
        ))}
      </TouchableOpacity>

      <FlatList
        data={parseTemplateRules}
        renderItem={({ item }) => <RulesListItem rules={item} />}
        keyExtractor={(item, index) => index}
      />
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: themePrimary[50],
    borderWidth: 1,
    borderColor: 'white',
  },
  cell: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  errorMessage: {
    padding: 5,
    backgroundColor: secondaryOrange[50],
    marginBottom: 10,
  },
});
