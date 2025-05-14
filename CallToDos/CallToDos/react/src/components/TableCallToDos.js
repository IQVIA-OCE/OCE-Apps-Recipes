import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Table, Select, Button, Checkbox, Portal, Modal, Paragraph, MenuButton} from '@oce-apps/apollo-react-native';
import { formatDate, queryWithSOQL } from '../utils/helpers';
import { TodoContext } from "../utils/context";

export const CustomHeader = ({ onBulkEdit, onBulkDelete, selectedRows, canAdd, canEdit, canDelete, handleOpenToDos }) => {
  let menuItems = [];
  const menuItemEdit = {
    text: 'Edit',
    onPress: onBulkEdit,
  };
  const menuItemDelete = {
    text: 'Delete',
    onPress: onBulkDelete,
  };

  if (canEdit)
  {
    menuItems = [...menuItems, menuItemEdit];
  }
  if (canDelete)
  {
    menuItems = [...menuItems, menuItemDelete];
  }
  return (
    <View style={{flex: 1, flexDirection: 'row-reverse'}}>
      <Button
        testID="add-button"
        style={styles.button}
        mode="contained"
        onPress={() => handleOpenToDos(true)}
        disabled={!canAdd}
      >
        Add
      </Button>
      <View testID="bulkactions-button">
        <MenuButton
          style={styles.buttonBulk}
          arrowColor="white"
          mode="contained"
          buttonText="Actions"
          menuItems={menuItems}
          disabled={selectedRows != undefined && selectedRows.length === 0}
        />
      </View>
    </View>
  );
};

export const sortStrings = (accessor, sortOrder, a, b) => {
  if (sortOrder === "ascending") {
    return a[accessor] > b[accessor] ? 1 : b[accessor] > a[accessor] ? -1 : 0;
  } else {
    return a[accessor] < b[accessor] ? 1 : b[accessor] < a[accessor] ? -1 : 0;
  }
};

export const sortPicklists = (accessor, sortOrder, a, b) => {
  if (sortOrder === "ascending") {
    return a[accessor].label > b[accessor].label ? 1 : b[accessor].label > a[accessor].label ? -1 : 0;
  } else {
    return a[accessor].label < b[accessor].label ? 1 : b[accessor].label < a[accessor].label ? -1 : 0;
  }
};

export const CellName = ({ row: { rowId, handleSelectRow }, row, column }) => { 
  return (
    <View style={{ paddingRight: 5, flexShrink: 1 }}>
      <Text numberOfLines={5} ellipsizeMode={'tail'} testID={`cellname_${rowId}`} onPress={() => handleSelectRow(rowId)}>{row[column.accessor]}</Text>
    </View>
  );
};

export const Cell = ({ row, column }) => {
  return (
    <View style={{ paddingRight: 5, flexShrink: 1 }}>
      <Text numberOfLines={5} ellipsizeMode={'tail'} >{row[column.accessor]}</Text>
    </View>
  );
};

export const CellDate = ({ row, column }) => {
  return (
    <View style={{ paddingRight: 5, flexShrink: 1 }}>
      <Text>{formatDate(row[column.accessor])}</Text>
    </View>
  );
};

export const CheckboxCell = ({
  row: { selectedRows, rowId, handleSelectRow },
}) => (
  <View>
    <Checkbox
      testID={`checkbox_${rowId}`} checked={selectedRows != undefined && selectedRows.includes(rowId)}
      onChange={() => handleSelectRow(rowId)}
      color="#4169E1"
    />
  </View>
);

export const makeEditableSelectCell = (options, { width }) => ({
  row,
  column: { accessor: key },
}) => {
  return row.editMode ? (
    <View style={{ paddingRight: 10 }}>
      <Select
        size="small"
        width={width}
        canDeselect={false}
        value={row.editedRow[key]}
        onChange={(value) => row.editRow(key, value)}
        options={options}
        hideDropdownPlaceholder
      />
    </View>
  ) : (
    <Text style={{ width: 120 }}>{row[key].label}</Text>
  );
};

export const TableCallToDos = (props) => {
  const {buttonHeaders, handleOpenToDos, isTestCT, refreshing} = props;
  const {state,dispatch} = useContext(TodoContext);
  
  const [rows, setRows] = useState([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [status, setStatus] = useState('');
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [confirmBulkEdit, setConfirmBulkEdit] = useState(false);
  const [canAdd, setCanAdd] = useState(true);
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(true);

  const fetchData = async () => {
    let query = `select Id, OCE__ToDo__r.Name, OCE__ToDo__c, OCE__ToDo__r.OCE__AssignedTo__r.Name, OCE__ToDo__r.OCE__DueDate__c, OCE__Status__c from OCE__CallToDo__c where recordtype.name = 'Call To-Do' and OCE__Call__c = '${state.recordId}' ORDER BY CreatedDate DESC`;
    let records = await queryWithSOQL(query);
    if (records.length > 0) {
      let i = 1;
      records.forEach((node) => {
        node.rowId = i;
        ++i;
        node.name = (node['OCE__ToDo__r.Name'] ? node['OCE__ToDo__r.Name'] : node['OCE__ToDo__r'] ? node['OCE__ToDo__r']['Name'] : '');
        node.OCE__AssignedTo = (node['OCE__ToDo__r.OCE__AssignedTo__r.Name'] ? node['OCE__ToDo__r.OCE__AssignedTo__r.Name'] : node['OCE__ToDo__r'] ? node['OCE__ToDo__r']['OCE__AssignedTo__r']['Name'] : '');
        node.OCE__DueDate__c = (node['OCE__ToDo__r.OCE__DueDate__c'] ? node['OCE__ToDo__r.OCE__DueDate__c'] : node['OCE__ToDo__r'] ? node['OCE__ToDo__r']['OCE__DueDate__c'] : '');
        node.rowStatus = { label: node.OCE__Status__c, id: node.OCE__Status__c }
      });
      setRows(records);
    }
  };

  const setPermissions = (perm) => {   
    if (perm.childObjectContextFound) {
      setCanAdd(perm.canAddChild);
      setCanEdit(perm.canEditChild);
      setCanDelete(perm.canDeleteChild);
    }
    else {
      if (perm.mainObjectContextFound) {
        setCanAdd(perm.canAddMain);
        setCanEdit(perm.canEditMain);
        setCanDelete(perm.canDeleteMain);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchData();
    }
  }, [refreshing]);

  useEffect(() => {
    setPermissions(state.permissions);
  }, [state]);

  const handleSelectRow = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((theRowId) => theRowId !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  
  const onBulkEdit = () => {
    setBulkEditMode(true);
  };

  
  const handleConfirmBulkEdit = () => {
    setConfirmBulkEdit(true);
  };

  
  const onUpdateAll = () => {  
    dispatch(
      {
        type: "UPDATE_CALL_TO_DO",
        payload: rows.map((row) =>
                    selectedRows.includes(row.rowId)
                      ? { ...row, rowStatus: status }
                      : row
                  ).filter((row) => selectedRows.includes(row.rowId))
      }
    );
    setRows(
      rows.map((row) =>
        selectedRows.includes(row.rowId)
          ? { ...row, rowStatus: status }
          : row
      )
    );
    setSelectedRows([]);
    setStatus('');
    setConfirmBulkEdit(false);
    setBulkEditMode(false);
  };

  
  const onBulkDelete = () => {
    setBulkDeleteMode(true);
  };

  
  const onDeleteAll = () => {
    dispatch(
      {
        type: "DELETE_CALL_TO_DO",
        payload: rows.filter((row) => selectedRows.includes(row.rowId))
      }
    );
    setRows(rows.filter((row) => !selectedRows.includes(row.rowId)));
    setSelectedRows([]);
    setBulkDeleteMode(false);
  };

  const columns = [
    {
      header: '',
      accessor: 'checkbox',
      customCell: CheckboxCell
    },
    {
      header: 'Table Id',
      accessor: 'rowId',
      sortFunction: null,
      hidden: true
    },
    {
      header: 'Call ToDo Id',
      accessor: 'Id',
      sortFunction: null,
      hidden: true
    },
    {
      header: 'ToDo Id',
      accessor: 'OCE__ToDo__c',
      sortFunction: null,
      hidden: true
    },
    {
      header: 'Name',
      accessor: 'name',
      sortFunction: sortStrings,
      customCell: CellName
    },
    {
      header: 'Assigned To',
      accessor: 'OCE__AssignedTo',
      sortFunction: sortStrings,
      customCell: Cell
    },
    {
      header: 'Due Date',
      accessor: 'OCE__DueDate__c',
      sortFunction: sortStrings,
      customCell: CellDate
    },
    {
      header: 'Status',
      accessor: 'rowStatus',
      sortFunction: sortPicklists,
      customCell: makeEditableSelectCell(
        [
          { label: 'New', id: 'New' },
          { label: 'Rejected', id: 'Rejected' },
          { label: 'Approved', id: 'Approved' },
          { label: 'Completed', id: 'Completed' },
        ],
        { width: 115 }
      )
    }
  ];

  const testFuncsCT = () => {
    onBulkEdit();
    handleConfirmBulkEdit();
    onUpdateAll();
    onBulkDelete();
    onDeleteAll();

    setPermissions({
      canAddMain: true,
      canEditMain: true,
      canDeleteMain: true,
      mainObjectContextFound: true,
      canAddChild: true,
      canEditChild: true,
      canDeleteChild: true,
      childObjectContextFound: false,
    });
    setPermissions({
      canAddMain: true,
      canEditMain: true,
      canDeleteMain: true,
      mainObjectContextFound: true,
      canAddChild: true,
      canEditChild: true,
      canDeleteChild: true,
      childObjectContextFound: true,
    });

  };

  return (
  <View>
    <Table
      testID="tableCT"
      title={buttonHeaders}
      //title="call to do"
      columns={columns}
      rows={rows.map((row) => ({
        ...row,
        selectedRows,
        handleSelectRow,
        key: row.rowId,
      }))}
      initialSortedColumn="name"
      initialSortOrder="ascending"
      rowsPerPageOptions={[5, 10, 15]}
      stripedRows
      inlinePagination
      columnWidth={[36, 'auto', 'auto', 'auto', 'auto']}
      CustomHeader={CustomHeader}
      headerProps={{ onBulkEdit, onBulkDelete, selectedRows, canAdd, canEdit, canDelete, handleOpenToDos }}
    />
    <Portal>
      <Modal
        visible={bulkEditMode}
        onDismiss={() => setBulkEditMode(false)}
        variant={confirmBulkEdit ? 'warning' : 'default'}
      >
        <Modal.Title
          title="Bulk Edit"
          subtitle={
            confirmBulkEdit
              ? ''
              : `${selectedRows.length} ${
                  selectedRows.length === 1 ? 'row' : 'rows'
                } selected`
          }
          closeIcon
        />
        <Modal.Content>
          <Paragraph>
            {confirmBulkEdit &&
              `You're about to edit ${selectedRows.length} ${
                selectedRows.length === 1 ? 'row' : 'rows'
              }. Are you sure you want to continue?`}
          </Paragraph>
          {confirmBulkEdit ? null : (
            <View>
              <Select
                label="Status"
                size="small"
                fullWidth
                value={status}
                onChange={(value) => setStatus(value)}
                options={[
                  {
                      id: 'New',
                      label: 'New',
                  },
                  {
                      id: 'Rejected',
                      label: 'Rejected',
                  },
                  {
                      id: 'Approved',
                      label: 'Approved',
                  },
                  {
                      id: 'Completed',
                      label: 'Completed',
                  },
                ]}
                hideDropdownPlaceholder
              />
            </View>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            mode="contained"
            color="tertiary"
            onPress={confirmBulkEdit ? () => setConfirmBulkEdit(false) : () => setBulkEditMode(false)}
          >
            {confirmBulkEdit ? 'Back' : 'Cancel'}
          </Button>
          <Button
            mode="contained"
            onPress={
              confirmBulkEdit ? onUpdateAll : handleConfirmBulkEdit
            }
          >
            {confirmBulkEdit ? 'Continue' : 'Update all'}
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal
        visible={bulkDeleteMode}
        onDismiss={() => setBulkDeleteMode(false)}
        variant="warning"
      >
        <Modal.Title title="Bulk Delete" />
        <Modal.Content>
          <Paragraph>
            {`You're about to delete ${selectedRows.length} ${
              selectedRows.length === 1 ? 'row' : 'rows'
            }. Are you sure you want to continue?`}
          </Paragraph>
        </Modal.Content>
        <Modal.Actions>
          <Button color="tertiary" mode="contained" onPress={() => setBulkDeleteMode(false)}>
            {'Cancel'}
          </Button>
          <Button mode="contained" onPress={onDeleteAll}>
            {'Delete all'}
          </Button>
        </Modal.Actions>
      </Modal>
    </Portal>
    { isTestCT &&
      <View>
        <Button
          testID='buttonFuncs-testCT'
          title="buttonFuncs-testCT"
          onPress={() => testFuncsCT()}
        />
      </View>
    }
  </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    marginBottom: 10,
  },
  buttonBulk: {
    marginRight: 10,
    marginBottom: 10,
  }
});