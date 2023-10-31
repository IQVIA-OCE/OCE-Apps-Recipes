import { View } from 'react-native';
import { Checkbox, IconButton, IconMenuButton, Text, useTheme } from 'apollo-react-native';
import React from 'react';
import { isIphone, formatDateInUserLocaleAndTimezone } from '../../utils';

const ActionCell = ({ row }) => {
  const { onApprove, onReject, onReassign } = row;

  const menuItems = [
    {
      text: 'Approve',
      onPress: onApprove,
    },
    {
      text: 'Reject',
      onPress: onReject,
    },
    {
      text: 'Reassign',
      onPress: onReassign,
    },
  ];

  return (
    <View
      style={{
        alignItems: isIphone ? 'flex-start' : 'flex-end',
        width: '100%',
      }}
    >
      <IconMenuButton menuItems={menuItems} size="small" />
    </View>
  );
};

const Cell = ({ row, column }) => {
  return (
    <Text style={{ paddingRight: 5 }} numberOfLines={1} ellipsizeMode="tail">
      {row[column.accessor]}
    </Text>
  );
};

const DateCell = ({ row, column }) => {
  const formattedDate = formatDateInUserLocaleAndTimezone(row[column.accessor]);

  return (
    <Text style={{ paddingRight: 5 }} numberOfLines={1} ellipsizeMode="tail">
      {formattedDate}
    </Text>
  );
};

export const CheckboxCell = ({ row: { selectedRows, id, handleSelectRow } }) => (
  <View>
    <Checkbox checked={selectedRows !== undefined && selectedRows.includes(id)} onChange={() => handleSelectRow(id)} />
  </View>
);

const ExpandCell = ({ row: { id, handleToggleRow, expanded } }) => {
  return (
    <IconButton size={25} onPress={() => handleToggleRow(id)} icon={expanded ? 'chevron-down' : 'chevron-right'} />
  );
};

export const DetailRow = ({ row }) => {
  const theme = useTheme();
  const backgroundColor = theme.dark ? '#000' : '#f8f9fbb8';

  const cellStyle = {
    marginBottom: 12,
  }

  if (!isIphone) {
    cellStyle.maxWidth = 400;
    cellStyle.minWidth = 200;
  }

  const cellTitleStyle = { fontWeight: '500' };
  const cellValueStyle = { marginTop: 6 };

  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: 15,
        paddingHorizontal: 30,
        flexDirection: isIphone ? 'column' : 'row',
        justifyContent: 'space-between',
        flexWrap: !isIphone ? 'wrap' : 'nowrap',
        width: '100%',
        backgroundColor,
        borderBottomWidth: 1,
        borderColor: '#d9d9d9',
      }}
    >
      <View style={cellStyle}>
        <Text style={cellTitleStyle}>Related To</Text>
        <Text style={cellValueStyle}>{row.name}</Text>
      </View>
      <View style={cellStyle}>
        <Text style={cellTitleStyle}>Type</Text>
        <Text style={cellValueStyle}>{row.label}</Text>
      </View>
      <View style={cellStyle}>
        <Text style={cellTitleStyle}>Submitted By</Text>
        <Text style={cellValueStyle}>{row.submittedBy}</Text>
      </View>
      <View style={cellStyle}>
        <Text style={cellTitleStyle}>Date Submitted</Text>
        <Text style={cellValueStyle}>{formatDateInUserLocaleAndTimezone(row.createdDate)}</Text>
      </View>
      <View style={cellStyle}>
        <Text style={cellTitleStyle}>Comments</Text>
        <Text style={cellValueStyle}>{row.comment}</Text>
      </View>
    </View>
  );
};

export const expandColumn = {
  accessor: 'expand',
  customCell: ExpandCell,
};

export const columnsIpad = [
  {
    header: 'Related To',
    accessor: 'name',
    customCell: Cell,
  },
  {
    header: 'Type',
    accessor: 'label',
    customCell: Cell,
  },
  {
    header: 'Submitted By',
    accessor: 'submittedBy',
    customCell: Cell,
  },
  {
    header: 'Date Submitted',
    accessor: 'createdDate',
    customCell: DateCell,
  },
  {
    header: 'Comments',
    accessor: 'comment',
    customCell: Cell,
  },
];

export const columnsIphone = [
  {
    header: 'Related To',
    accessor: 'name',
    customCell: Cell,
  },
];

export const actionsColumn = {
  accessor: 'action',
  customCell: ActionCell,
  align: 'right',
};
