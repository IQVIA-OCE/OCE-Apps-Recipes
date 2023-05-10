import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ApolloProgress, Select, IconButton, useTheme } from 'apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadingStatusSelector,
  templatesSelector,
} from '../../store/ReconciliationReport/ReconciliationReportSelectors';
import {
  bootstrap,
  setAccountSearchQuery,
  setSortOrder,
  setSortField,
  setTemplateFilter,
} from '../../store/ReconciliationReport/ReconciliationReportSlice';
import { LOADING_STATUS } from '../../constants';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { AccountList } from '../../components/AccountList/AccountList';
import color from 'color';

export const ReportAccountsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const templateItems = useSelector(templatesSelector);

  const loadingStatus = useSelector(loadingStatusSelector);
  const isLoading = loadingStatus === LOADING_STATUS.PENDING;
  const isFailed = loadingStatus === LOADING_STATUS.FAILED;

  const columnTitles = [
    { label: 'Account Name', value: 'accountName' },
    { label: 'Account Specialty', value: 'accountSpecialty' },
    { label: 'Sample Product', value: 'sampleName' },
    { label: 'Limit Template', value: 'limitTemplateName' },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSortColumn, setSelectedSortColumn] = useState(columnTitles[0]);
  const [sortAscending, setAscendingSortOrder] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    dispatch(bootstrap());
  }, []);

  const filterByTemplate = (val) => {
    setSelectedTemplate(val);
    const filterValue = val ? val.value : null;
    dispatch(setTemplateFilter(filterValue));
  };

  const sortByColumn = (val) => {
    setSelectedSortColumn(val);
    const sortValue = val ? val.value : null;
    dispatch(setSortField(sortValue));
  };

  const sortOrderColumn = (val) => {
    setAscendingSortOrder(val);
    dispatch(setSortOrder(val));
  };

  const onSearch = (value) => {
    dispatch(setAccountSearchQuery(value));
  };

  return (
    <Card style={styles.generalContainer}>
      {isLoading && <ApolloProgress style={[styles.loader, { backgroundColor: color(theme.colors.surface).alpha(0.8).string()}]} testID="loader-wrap"/>}

      {!isFailed && (
        <View style={styles.headerContainer}>
          <View style={styles.filterContainer}>
            <View style={styles.searchBox}>
              <SearchInput isLoading={isLoading} onSearch={onSearch} />
            </View>

            <View style={styles.selectBox}>
              <Select
                testID="template-select"
                options={templateItems}
                placeholder="Select template..."
                value={selectedTemplate}
                onChange={(val) => filterByTemplate(val)}
                disabled={isLoading}
                width={250}
              />
            </View>
          </View>

          <View style={styles.filterContainer}>
            <View style={styles.titleBox}>
              <Text style={[styles.title, { color: theme.colors.text }]}>Sort by: </Text>
            </View>
            <View style={styles.selectBox}>
              <Select
                testID="column-select"
                options={columnTitles}
                placeholder="Column..."
                value={selectedSortColumn}
                onChange={(val) => sortByColumn(val)}
                disabled={isLoading}
              />
            </View>
            <IconButton
              icon={sortAscending ? 'arrow-up' : 'arrow-down'}
              size={24}
              onPress={() => sortOrderColumn(!sortAscending)}
            />
          </View>
        </View>
      )}
      {!isFailed && <AccountList navigation={navigation} />}
    </Card>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    padding: 15,
    flex: 1,
    borderRadius: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  searchBox: {
    maxWidth: 250,
    marginRight: 10,
  },
  selectBox: {
    padding: 2,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  titleBox: {
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
  },
});
