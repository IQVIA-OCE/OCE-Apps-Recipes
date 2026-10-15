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
import { useTheme } from '@oce-apps/apollo-react-native';
import { RulesListItem } from '../../RulesListItem/RulesListItem';
import color from 'color';

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
      navigation,
    });
    dispatch(setCallActivityData(id));
  };

  const theme = useTheme();
  const rowBackColor = theme.dark
    ? color(theme.colors.surface).lighten(0.6).hex()
    : color(theme.colors.primary).lighten(0.845).hex();

  const tableDataValues = Object.values(tableDate);

  const renderTableData = () => {
    return tableDataValues.map((field, idx) => (
      <View
        key={idx}
        style={[
          styles.cell,
          { borderRightColor: theme.colors.surface },
        ]}>
        <Text numberOfLines={2} style={{ color: theme.colors.text }}>{field}</Text>
      </View>
    ))};

  return (
    <View>
      <TouchableOpacity
        style={[styles.row, {
          backgroundColor: rowBackColor,
          borderColor: theme.colors.surface,
        }]}
        onPress={() => onShowActivity()}
      >
        {renderTableData()}
      </TouchableOpacity>

      <FlatList
        data={parseTemplateRules}
        renderItem={({ item }) => <RulesListItem rules={item} />}
        keyExtractor={(item, index) => index}
      />
      <View style={{ borderWidth: 2, borderColor: theme.colors.surface }}>
        <Text style={[styles.errorMessage, { backgroundColor: color(theme.colors.warning).lighten(0.88).hex()}]}>{errorMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    borderWidth: 1,
  },
  cell: {
    flex: 1,
    borderRightWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 15,
    height: '100%',
  },
  errorMessage: {
    padding: 5,
    marginBottom: 10,
  },
});
