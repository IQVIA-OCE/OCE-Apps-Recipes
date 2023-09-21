import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Button, Modal, Portal, TextInput, useTheme, Text } from 'apollo-react-native';
import { useEffect, useRef, useState } from 'react';
import color from 'color';
import { SearchInput } from '../SearchInput/SearchInput';
import { AccountsList } from '../AccountsList/AccountsList';
import { NAMESPACE, SORT_ORDER, ACCOUNTS_LIST_SORT_COLUMN } from '../../constants';
import { fetchAccounts, fetchByQueryLocator } from '../../api/callToDoApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAvoidingModal } from '../KeyboardAvoidingModal/KeyboardAvoidingModal';

const RADIO_BUTTON_CELL_WIDTH = 35;

const mapAccount = (acc) => ({
  id: acc.Id,
  name: acc.Name,
  kanaName: acc[`${NAMESPACE}KanaName__c`],
});

const COLUMNS = [
  {
    label: 'Name',
    value: ACCOUNTS_LIST_SORT_COLUMN.NAME,
  },
  {
    label: 'Kana Name',
    value: ACCOUNTS_LIST_SORT_COLUMN.KANANAME,
  },
];

const ListHeaderCell = ({ value, label, sortColumn, sortOrder, cellWidth, onSort }) => {
  const theme = useTheme();
  const spinAnim = useRef(new Animated.Value(sortOrder === SORT_ORDER.ASCENDING ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(spinAnim, {
      toValue: sortOrder === SORT_ORDER.ASCENDING ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [sortOrder]);

  return (
    <View style={[styles.listContainerHeaderCell, { width: cellWidth }]}>
      <Pressable
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          onSort(value);
        }}
        testID="listHeaderCell"
      >
        <Text style={styles.listContainerHeaderCellText}>{label}</Text>
        {sortColumn === value && (
          <Animated.View
            style={[
              {
                transform: [
                  {
                    rotate: spinAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name={'arrow-down'} size={16} color={theme.colors.text} />
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
};

export const IntervieweeLookupField = ({ interviewee, callAccountId, onChange, onFetchError }) => {
  const theme = useTheme();
  const [innerValue, setInnerValue] = useState(interviewee);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(ACCOUNTS_LIST_SORT_COLUMN.KANANAME);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.ASCENDING);
  const [queryLocator, setQueryLocator] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [listContainerWidth, setListContainerWidth] = useState(null);

  useEffect(() => {
    getAccounts({ parentId: callAccountId, searchQuery, sortColumn, sortOrder });
  }, [searchQuery, sortColumn, sortOrder]);

  const getAccounts = async ({ parentId, searchQuery, sortColumn, sortOrder }) => {
    setIsLoading(true);

    try {
      const { done, queryLocator: ql, records } = await fetchAccounts({ parentId, searchQuery, sortColumn, sortOrder });
      const newQueryLocator = done === false ? ql : '';
      setQueryLocator(newQueryLocator);
      setAccounts(records.map(mapAccount));
    } catch (error) {
      console.log(error);
      onFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreAccounts = async () => {
    if (queryLocator.length === 0) return;

    try {
      const { done, queryLocator: ql, records } = await fetchByQueryLocator(queryLocator);

      const newQueryLocator = done === false ? ql : '';
      setQueryLocator(newQueryLocator);

      setAccounts((accs) => [...accs, ...records.map(mapAccount)]);
    } catch (error) {
      console.log(error);
      onFetchError(error);
    }
  };

  const handleSort = (nextSortColumn) => {
    if (sortColumn === nextSortColumn) {
      setSortOrder((prevOrder) => (prevOrder === SORT_ORDER.ASCENDING ? SORT_ORDER.DESCENDING : SORT_ORDER.ASCENDING));
    } else {
      setSortColumn(nextSortColumn);
      setSortOrder(SORT_ORDER.ASCENDING);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setSearchQuery('');
    setIsModalOpen(false);
  };

  const headerBackgroundColor = theme.dark
    ? color(theme.colors.surface).darken(0.3).hex()
    : color(theme.colors.surface).darken(0.018).mix(color(theme.colors.primary), 0.011).hex();

  const cellWidth = listContainerWidth ? (listContainerWidth - RADIO_BUTTON_CELL_WIDTH) / 2 : null;

  return (
    <>
      <Pressable onPress={handleOpenModal}>
        <TextInput
          label="Interviewee"
          leftIcon={'magnify'}
          left={
            interviewee && (
              <Text testID="selectedIntervieweeLabel" style={{ color: theme.colors.text }}>
                {interviewee.label}
              </Text>
            )
          }
          fullWidth
          editable={false}
          pointerEvents="none"
          placeholder={!interviewee ? 'Search' : ''}
          icon={interviewee && 'close'}
          onIconPress={() => {
            setInnerValue(null);
            onChange(null);
          }}
          testID="intervieweeLookupTextInput"
        />
      </Pressable>

      <Portal>
        <KeyboardAvoidingModal visible={isModalOpen} onDismiss={handleCloseModal} additionalTopSpacing={50}>
          <Modal.Title title="Interviewee" subtitle="Select interviewee" closeIcon />
          <Modal.Content>
            <View style={styles.modalContent} testID="intervieweeLookupModalContainer">
              <View style={{ marginBottom: 20 }}>
                <SearchInput
                  onSearch={(val) => {
                    setSearchQuery(val);
                  }}
                  testID={'searchInput'}
                />
              </View>
              <View
                style={styles.listContainer}
                onLayout={(e) => {
                  if (listContainerWidth === null) {
                    setListContainerWidth(e.nativeEvent.layout.width);
                  }
                }}
                testID="listContainer"
              >
                <View style={[styles.listContainerHeader, { backgroundColor: headerBackgroundColor }]}>
                  <View style={[styles.listContainerHeaderCell, { width: RADIO_BUTTON_CELL_WIDTH, flexGrow: 0 }]} />
                  {COLUMNS.map(({ label, value }) => (
                    <ListHeaderCell
                      key={value}
                      label={label}
                      value={value}
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      cellWidth={cellWidth}
                      onSort={handleSort}
                    />
                  ))}
                </View>
                <AccountsList
                  selectedAccount={innerValue}
                  data={accounts}
                  cellWidth={cellWidth}
                  isLoading={isLoading}
                  loadMore={loadMoreAccounts}
                  onItemPress={(item) => {
                    setInnerValue({ label: item.name, value: item.id });
                  }}
                />
              </View>
            </View>
          </Modal.Content>
          <Modal.Actions>
            <Button mode="contained" color="tertiary" onPress={handleCloseModal}>
              Cancel
            </Button>
            <Button
              loading={false}
              mode="contained"
              disabled={false}
              onPress={() => {
                onChange(innerValue);
                handleCloseModal();
              }}
            >
              Save
            </Button>
          </Modal.Actions>
        </KeyboardAvoidingModal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listContainerHeader: {
    flexDirection: 'row',
  },
  listContainerHeaderCell: {
    flexGrow: 1,
    height: 40,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  listContainerHeaderCellText: {
    fontWeight: '500',
    marginRight: 5,
  },
  modalContent: {
    width: 700,
    height: 380,
    flexGrow: 1,
  },
});
