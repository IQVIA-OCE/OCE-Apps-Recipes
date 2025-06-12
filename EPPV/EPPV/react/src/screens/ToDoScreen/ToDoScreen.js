import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View, Platform } from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import color from 'color';

import {
  fetchToDo,
  fetchByQueryLocator,
  fetchComplianceMetadata,
} from '../../api';
import {
  Select,
  useTheme,
  IconButton,
  Text,
  ApolloProgress,
  Banner,
} from '@oce-apps/apollo-react-native';
import { ToDoList } from '../../components/ToDoList/ToDoList';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { isIphone, normalizeToDo } from '../../utils';
import {
  NAMESPACE,
  SORT_BY_TEXT,
  SORT_COLUMN,
  SORT_ORDER,
} from '../../constants';
import { useDidMountEffect, useBanner } from '../../hooks';

export const ToDoScreen = () => {
  const [toDoList, setToDoList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [queryLocator, setQueryLocator] = useState('');
  const [complianceType, setComplianceType] = useState([]);
  const [selectedComplianceType, setSelectedComplianceType] = useState(null);
  const [banner, setBanner] = useBanner({});

  const initialSortColumn = SORT_COLUMN.find(
    (col) => col.label === 'Cycle Start Date'
  );
  const [sortColumn, setSortColum] = useState({
    ...initialSortColumn,
    label: `${SORT_BY_TEXT}${initialSortColumn.label}`,
  });

  const [sortDirection, setSortDirection] = useState(SORT_ORDER.DESC);
  const [searchValue, setSearchValue] = useState('');

  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const getTodoData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        done,
        queryLocator: ql,
        records,
      } = await fetchToDo({
        sortDirection,
        sortColumn,
        selectedComplianceType,
        searchValue,
      });

      const newQueryLocator = done === false ? ql : '';
      setQueryLocator(newQueryLocator);

      const normalizedRecords = normalizeToDo(records);
      setToDoList(normalizedRecords);
    } catch (error) {
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    } finally {
      setIsLoading(false);
    }
  }, [sortColumn, sortDirection, selectedComplianceType, searchValue]);

  const loadMoreTodoData = async () => {
    if (queryLocator.length === 0) return;

    try {
      const {
        done,
        queryLocator: ql,
        records,
      } = await fetchByQueryLocator(queryLocator);

      const newQueryLocator = done === false ? ql : '';
      setQueryLocator(newQueryLocator);

      const normalizedRecords = normalizeToDo(records);
      setToDoList([...toDoList, ...normalizedRecords]);
    } catch (error) {
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  const getComplianceTypePicklist = useCallback(async () => {
    try {
      const complianceMetadata = await fetchComplianceMetadata();
      const complianceTypeField = complianceMetadata.fields.find(
        (item) => item.name === `${NAMESPACE}ComplianceType__c`
      );
      const complianceTypePicklist = complianceTypeField.picklistValues.filter(
        (pVal) => pVal.active === true
      );
      const eppvPicklistValue = complianceTypePicklist.find(
        (pVal) => pVal.value === 'EPPV'
      );
      setComplianceType(complianceTypePicklist);
      setSelectedComplianceType(eppvPicklistValue);
    } catch (error) {
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  }, []);

  useEffect(() => {
    getComplianceTypePicklist();
  }, [getComplianceTypePicklist]);

  useDidMountEffect(() => {
    getTodoData();
  }, [getTodoData]);

  useFocusEffect(
    useCallback(() => {
      if (route.params && route.params?.refreshToDoList) {
        getTodoData();
      }
      return () => {
        navigation.setParams({
          refreshToDoList: false,
        });
      };
    }, [route.params?.refreshToDoList])
  );

  const openCompleteForm = (item) => {
    navigation.navigate('CompleteToDo', item);
  };

  const borderSeparatorColor = theme.dark
    ? color(theme.colors.placeholder).darken(0.7).hex()
    : color(theme.colors.surface).darken(0.1).hex();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <Banner
        variant={banner.variant}
        icon={banner.icon}
        visible={banner.visible}
        testID={'toDoScreenBanner'}
      >
        {banner.message}
      </Banner>
      <View
        style={[
          styles.filterContainer,
          {
            borderBottomColor: borderSeparatorColor,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
          }}
        >
          <View
            style={[
              styles.titleContainer,
              { borderColor: borderSeparatorColor },
            ]}
          >
            <Text style={styles.titleMainText}>EPPV</Text>
            <Text style={styles.titleSecondaryText}>ToDo List</Text>
          </View>
          <Select
            options={complianceType}
            value={selectedComplianceType}
            canDeselect={false}
            label={'Compliance Type'}
            onChange={(item) => setSelectedComplianceType(item)}
            disabled={isLoading}
            hideDropdownPlaceholder
          />
        </View>
        <View style={styles.sortFilterContainer}>
          <View style={{ flex: 1 }}>
            <SearchInput
              isDisabled={isLoading}
              onSearch={(val) => setSearchValue(val)}
              testID={'searchInput'}
            />
          </View>
          <View style={styles.selectBox} testID={'sortColumnWrapper'}>
            <Select
              options={SORT_COLUMN}
              value={sortColumn}
              onChange={(val) =>
                setSortColum({ ...val, label: `${SORT_BY_TEXT}${val.label}` })
              }
              disabled={isLoading}
              style={{ backgroundColor: 'none' }}
              containerStyles={{
                backgroundColor: 'none',
                borderWidth: 0,
              }}
              theme={{
                ...theme,
                colors: { ...theme.colors, text: '#33b2fe' },
                textInput: {
                  ...theme.textInput,
                  medium: {
                    fontSize: 18,
                  },
                },
                fonts: {
                  ...theme.fonts,
                  regular: {
                    ...theme.fonts.regular,
                    textAlign: 'right',
                  },
                },
              }}
              hideDropdownPlaceholder
              canDeselect={false}
              selectIcon={() => (
                <View
                  style={{
                    display: 'none',
                  }}
                ></View>
              )}
              fullWidth
              size={'small'}
            />
          </View>
          <View style={[styles.sortOderButtonContainer, { marginLeft: -35 }]}>
            <IconButton
              icon={
                sortDirection === SORT_ORDER.ASC ? 'arrow-up' : 'arrow-down'
              }
              style={{ borderWidth: 0 }}
              size={isIphone ? 17 : 24}
              color={'#5bc0ff'}
              animated={true}
              onPress={() =>
                setSortDirection(
                  sortDirection === SORT_ORDER.DESC
                    ? SORT_ORDER.ASC
                    : SORT_ORDER.DESC
                )
              }
              testID={'sortIcon'}
            />
          </View>
        </View>
      </View>
      <View
        style={{ flex: 1, maxHeight: Platform.OS === 'web' ? 446 : '100%' }}
      >
        {isLoading && (
          <View
            style={[
              styles.loader,
              {
                backgroundColor: theme.dark
                  ? color(theme.colors.placeholder).darken(0.7).hex()
                  : color(theme.colors.surface).lighten(1).hex(),
              },
            ]}
          >
            <ApolloProgress />
          </View>
        )}
        <ToDoList
          data={toDoList}
          isLoading={isLoading}
          loadMoreTodoData={loadMoreTodoData}
          openCompleteForm={openCompleteForm}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortFilterContainer: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  filterContainer: {
    // padding: 20,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderBottomWidth: 1,
  },
  sortOderButtonContainer: {
    justifyContent: 'flex-end',
    marginLeft: -20,
  },
  selectBox: {
    width: 220,
    justifyContent: 'flex-end',
    // flex: 1,
  },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    opacity: 0.6,
  },
  titleContainer: {
    flexDirection: 'column',
    marginRight: 15,
    paddingRight: 15,
    borderRightWidth: 1,
  },
  titleMainText: {
    fontSize: 30,
    fontWeight: '600',
  },
  titleSecondaryText: {
    fontSize: 22,
    fontWeight: '300',
  },
});
