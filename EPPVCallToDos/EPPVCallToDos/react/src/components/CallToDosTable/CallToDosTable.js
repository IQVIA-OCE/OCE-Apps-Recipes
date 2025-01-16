import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { ApolloProgress, Button, Portal, Table, useTheme } from '@oce-apps/apollo-react-native';
import { CallToDoModal } from '../CallToDoModal/CallToDoModal';
import { useDispatch, useSelector } from 'react-redux';
import { bootstrap, deleteToDo, fetchCallToDos } from '../../store/callToDos/callToDosSlice';
import { callSelector, todosListLoadingStatusSelector } from '../../store/callToDos/callToDosSelectors';
import { LOADING_STATUS, SORT_ORDER } from '../../constants';
import { actionsColumn, columns } from './columns';
import { useCallToDosList } from './hooks/useCallToDosList';
import { alert } from '../../utils/alert';

const DEFAULT_SORT_COLUMN = 'complianceName';

export const CallToDosTable = ({ callId }) => {
  const [isToDoModalOpen, setIsToDoModalOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { callToDos, totalCount, params } = useCallToDosList();
  const { page, rowsPerPage, sortColumn, sortOrder } = params;
  const todosListLoadingStatus = useSelector(todosListLoadingStatusSelector);
  const call = useSelector(callSelector);
  const isDraftCall = call.status === 'Draft';
  const [selectedRecord, setSelectedRecord] = useState(null);

  const isBootstrapping = todosListLoadingStatus === LOADING_STATUS.BOOTSTRAPPING;
  const isLoading = todosListLoadingStatus === LOADING_STATUS.PENDING;

  useEffect(() => {
    dispatch(bootstrap(callId));
  }, []);

  useEffect(() => {
    if (!isBootstrapping && call.id) handleFetch(1, rowsPerPage, DEFAULT_SORT_COLUMN, SORT_ORDER.ASCENDING, call.id);
  }, [isBootstrapping, call.id]);

  const handleFetch = (page = 1, rowsPerPage, sortColumn, sortOrder, callId) => {
    dispatch(
      fetchCallToDos({
        page,
        rowsPerPage,
        sortColumn,
        sortOrder,
        callId,
      })
    );
  };

  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setIsToDoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsToDoModalOpen(false);
  };

  const handleDelete = (record) => {
    alert(
      '',
      'Are you sure you want to delete this record?',

      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(deleteToDo(record.id));
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  if (isBootstrapping && Platform.OS === 'web') {
    return (
      <View style={[styles.bigLoaderWrap, { backgroundColor: theme.colors.surface }]} testID="loader-wrap">
        <ApolloProgress />
      </View>
    );
  }

  const _columns = [...columns, isDraftCall && actionsColumn].filter(Boolean);

  return (
    <ScrollView>
      <Table
        title="EPPV/MID"
        columns={_columns}
        rows={callToDos.map((row) => ({
          ...row,
          onEdit: () => {
            handleOpenModal(row);
          },
          onDelete: () => {
            handleDelete(row);
          },
        }))}
        size={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
        sortedColumn={sortColumn || DEFAULT_SORT_COLUMN}
        sortOrder={sortOrder}
        isLoading={isLoading && Platform.OS === 'web'}
        onChange={(page, rowsPerPage, sortColumn, sortOrder) => {
          handleFetch(page, rowsPerPage, sortColumn, sortOrder, call.id);
        }}
        stripedRows
        inlinePagination
        nextButtonProps={{ testID: 'next-button' }}
        CustomHeader={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }} testID="table-custom-header">
            <Button
              onPress={() => handleOpenModal(null)}
              disabled={!isDraftCall}
              icon="plus"
              mode="contained"
              testID="new-button"
            >
              New
            </Button>
          </View>
        )}
      />

      <Portal>
        <CallToDoModal existingRecord={selectedRecord} isOpen={isToDoModalOpen} onClose={handleCloseModal} />
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
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
});
