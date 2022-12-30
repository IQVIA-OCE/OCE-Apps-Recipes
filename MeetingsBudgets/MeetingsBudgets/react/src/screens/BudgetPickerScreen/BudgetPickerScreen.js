import { ApolloProgress, Portal, Title } from 'apollo-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { localized } from 'oce-apps-bridges';
import CustomTooltip from '../../components/CustomTooltip';
import DataTable from '../../components/DataTable/DataTable';
import { FilterButton } from '../../components/FilterButton';
import { ListEmptyComponent } from '../../components/ListEmptyComponent';
import { SearchInput } from '../../components/SearchInput';
import { LOADING_STATUS, NAMESPACE } from '../../constants';
import {
  budgetsSelector,
  loadingStatusSelector,
  meetingSelector,
  searchQuerySelector,
  systemGeneratedFilterSelector,
} from '../../store/budgetPicker/budgetPickerSelectors';
import {
  bootstrap,
  fetchBudgets,
  fetchMoreBudgets,
  saveBudget,
  setBudgetSearchQuery,
  toggleSystemGeneratedFilter,
} from '../../store/budgetPicker/budgetPickerSlice';
import {
  formatAmount,
  formatDate,
  isIphone,
  sortCurrency,
  sortStrings,
} from '../../utils';

const columns = [
  {
    header: 'Name',
    accessor: 'name',
    sortFunction: sortStrings,
  },
  {
    header: 'Status',
    accessor: 'status',
    sortFunction: sortStrings,
  },
  {
    header: 'Start Date',
    accessor: 'startDate',
    sortFunction: sortStrings,
    isDate: true,
  },
  {
    header: 'End Date',
    accessor: 'endDate',
    sortFunction: sortStrings,
    isDate: true,
  },
  {
    header: 'Consumption Budget',
    accessor: 'consumptionBudget',
    sortFunction: sortStrings,
  },
  {
    header: 'Meeting Type',
    accessor: 'meetingType',
    sortFunction: sortStrings,
  },
  {
    header: 'Total Amount',
    accessor: 'totalAmount',
    sortFunction: sortCurrency,
  },
  {
    header: 'Estimated Amount',
    accessor: 'estimatedAmount',
    sortFunction: sortCurrency,
  },
  {
    header: 'Actual Amount',
    accessor: 'actualAmount',
    sortFunction: sortCurrency,
  },
  {
    header: 'Remaining',
    accessor: 'remaining',
    sortFunction: sortCurrency,
  },
];

export const BudgetPickerScreen = ({ parentId }) => {
  const dispatch = useDispatch();
  const budgets = useSelector(budgetsSelector);
  const meeting = useSelector(meetingSelector);
  const loadingStatus = useSelector(loadingStatusSelector);
  const searchQuery = useSelector(searchQuerySelector);
  const isSystemGeneratedFilterEnabled = useSelector(
    systemGeneratedFilterSelector
  );
  const isLoading = loadingStatus === LOADING_STATUS.PENDING;
  const isSubmitting = loadingStatus === LOADING_STATUS.SUBMITTING;
  const isBootstrapping = loadingStatus === LOADING_STATUS.BOOTSTRAPPING;
  const stopFetchMore = useRef(true);
  const filtersTooltip = localized(
    `${NAMESPACE.toLowerCase()}defaultbudgetfilter`,
    'Default Budget Filter'
  )
    .replace('%1$@', meeting.recordTypeDevName)
    .replace('%2$@', formatDate(meeting.startDate))
    .replace('%3$@', formatDate(meeting.endDate));

  useEffect(() => {
    dispatch(bootstrap(parentId));
  }, []);

  useEffect(() => {
    if (!isBootstrapping) handleFetch();
  }, [searchQuery, isSystemGeneratedFilterEnabled, isBootstrapping]);

  const handleFetch = () => {
    dispatch(fetchBudgets());
  };

  const handleFetchMore = () => {
    if (!stopFetchMore.current) {
      dispatch(fetchMoreBudgets());
      stopFetchMore.current = true;
    }
  };

  const handleScrollBeginDrag = () => {
    stopFetchMore.current = false;
  };

  const onSelectRow = (budget) => {
    dispatch(saveBudget(budget));
  };

  const onSearch = (value) => {
    dispatch(setBudgetSearchQuery(value));
  };

  const onSetFilter = () => {
    dispatch(toggleSystemGeneratedFilter());
  };

  if (isBootstrapping || isSubmitting) {
    return (
      <View style={styles.bigLoaderWrapper} testID={'apolloProgress'}>
        <ApolloProgress />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {isLoading && (
        <Portal>
          <View style={styles.loader}>
            <ApolloProgress />
          </View>
        </Portal>
      )}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>
            {localized(
              `${NAMESPACE.toLowerCase()}select_meeting_budget`,
              'Select Meeting Budget'
            )}
          </Title>
        </View>
        <View style={styles.searchContainer}>
          <SearchInput isDisabled={isLoading} onSearch={onSearch} />
        </View>
        <View style={styles.filterContainer}>
          <FilterButton
            onSetFilter={onSetFilter}
            isDisabled={isLoading}
            color={isSystemGeneratedFilterEnabled ? 'primary' : 'tertiary'}
          >
            {localized(
              `${NAMESPACE.toLowerCase()}systemgeneratedfilter`,
              'System Generated Filter'
            )}
          </FilterButton>
          <CustomTooltip
            title={filtersTooltip}
            variant="dark"
            placement={isIphone ? 'left' : 'right'}
            icon="information-outline"
            size={30}
            contentWidth={isIphone ? 230 : 'auto'}
          />
        </View>
      </View>
      <View style={{ height: 400 }}>
        <DataTable
          style={styles.table}
          columns={columns}
          rows={budgets.map((elem) => ({
            ...elem,
            actualAmount: formatAmount(elem.actualAmount, elem.currencyISOCode),
            consumptionBudget: elem.consumptionBudget ? 'True' : 'False',
            estimatedAmount: formatAmount(
              elem.estimatedAmount,
              elem.currencyISOCode
            ),
            remaining: formatAmount(elem.remaining, elem.currencyISOCode),
            totalAmount: formatAmount(elem.totalAmount, elem.currencyISOCode),
          }))}
          listEmptyComponent={() => (
            <ListEmptyComponent
              loadingStatus={loadingStatus}
              data={budgets}
              text={localized(
                `${NAMESPACE.toLowerCase()}meetingbudgetnotfound`,
                'No available budgets'
              )}
              testID={'listEmptyComponent'}
            />
          )}
          phoneSortedColumn="name"
          columnWidth={[230, 100, 130, 130, 220, 500, 160, 190, 160, 150]}
          horizontalScroll={!isIphone}
          verticalRow={isIphone}
          refreshing={isLoading}
          onEndReachedThreshold={0.5}
          onRowPress={onSelectRow}
          onRefresh={handleFetch}
          onEndReached={handleFetchMore}
          onScrollBeginDrag={handleScrollBeginDrag}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bigLoaderWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    padding: 15,
  },
  titleContainer: {
    marginBottom: 15,
  },
  searchContainer: {
    marginBottom: 15,
  },
  filterContainer: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
  table: {
    flexGrow: 1,
    flexBasis: 0,
  },
});
