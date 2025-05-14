import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { Table, Checkbox } from '@oce-apps/apollo-react-native';
import { formatDate, queryWithSOQL } from '../utils/helpers';
import { TodoContext } from "../utils/context";

export const CustomHeader = () => {
  return <View style={{ flexDirection: 'row' }}></View>;
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
      <Text testID={`cellname_${rowId}`} onPress={() => handleSelectRow(rowId)}>{row[column.accessor]}</Text>
    </View>
  );
};

export const Cell = ({ row, column }) => {
  return (
    <View style={{ paddingRight: 5, flexShrink: 1 }}>
      <Text>{row[column.accessor]}</Text>
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

export const TableBusinessToDos = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const {state,dispatch} = useContext(TodoContext);

  const fetchData = async () => {
    setRows([]);
    let addFilter = "";
    if (state.filterBusinessTodo.length > 0)
    {
      let whereClause = state.filterBusinessTodo;
      if (whereClause.startsWith(' and '))
        whereClause = whereClause.replace(/ and /, ' ');
      if (whereClause.startsWith(' or '))
        whereClause = whereClause.replace(/ or /, ' ');
      addFilter = `where ${whereClause}`;
    }
    let query = `select Id, Name, OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c, OCE__DueDate__c, OCE__Status__c from OCE__BusinessToDo__c ${addFilter} ORDER BY CreatedDate DESC`;
    let records = await queryWithSOQL(query);
    if (records.length > 0) {
      let i = 1;
      records.forEach((node) => {
        node.rowId = i;
        ++i;
        node.OCE__BusinessObjectiveProducts = (node['OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c'] ? node['OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c'] : node['OCE__BusinessTactic__r'] ? node['OCE__BusinessTactic__r']['OCE__BusinessObjective__r']['OCE__Product__c'] : null);
      });
      setRows(records);
    }
    dispatch(
      {
        type: "SEARCH_BUSINESS_TO_DO",
        payload: false
      }
    );
  };

  useEffect(() => {
    if (state.searchBusinessTodo && !state.setDefaultFiltersBusinessToDo)
    {
      fetchData();
    }
  }, [state]);

  const handleSelectRow = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((theRowId) => theRowId !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
    dispatch(
      {
        type: "ADD_BUSINESS_TO_DO",
        payload: rows.filter((row) => row.rowId == rowId )
      }
    );
  };
  
  const columns = [
    {
      header: '',
      accessor: '',
      customCell: CheckboxCell
    },
    {
      header: 'Table Id',
      accessor: 'rowId',
      sortFunction: sortStrings,
      hidden: true
    },
    {
      header: 'ToDo Id',
      accessor: 'Id',
      sortFunction: sortStrings,
      hidden: true
    },
    {
      header: 'Name',
      accessor: 'Name',
      sortFunction: sortStrings,
      customCell: CellName
    },
    {
      header: 'Products',
      accessor: 'OCE__BusinessObjectiveProducts',
      sortFunction: sortPicklists,
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
      accessor: 'OCE__Status__c',
      sortFunction: sortPicklists,
      customCell: Cell
    },
  ];

  return (
    <Table
      testID="table"
      title="Business To Dos"
      subtitle=""
      columns={columns}
      rows={rows.map((row) => ({
        ...row,
        selectedRows,
        handleSelectRow,
        key: row.id,
      }))}
      initialSortedColumn="Name"
      initialSortOrder="ascending"
      rowsPerPageOptions={[5, 10, 15]}
      stripedRows
      inlinePagination
      showFilterIcon
      columnWidth={[36, 'auto', 'auto', 'auto', 'auto']}
      CustomHeader={CustomHeader}
    />
  );
};