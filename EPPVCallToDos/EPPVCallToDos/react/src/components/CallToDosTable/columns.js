import { IconMenuButton, Text } from '@oce-apps/apollo-react-native';
import { View } from 'react-native';

const ActionCell = ({ row }) => {
  const { onEdit, onDelete } = row;

  const menuItems = [
    {
      text: 'Edit',
      onPress: onEdit,
    },
    {
      text: 'Delete',
      onPress: onDelete,
    },
  ];

  return (
    <View
      style={{
        alignItems: 'flex-end',
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

export const columns = [
  {
    header: 'Compliance Type',
    accessor: 'complianceType',
    customCell: Cell,
    filterFunction: null,
    filterComponent: null,
  },
  {
    header: 'Compliance',
    accessor: 'complianceName',
    customCell: Cell,
    filterFunction: null,
    filterComponent: null,
  },
  {
    header: 'Survey Type',
    accessor: 'surveyType',
    customCell: Cell,
  },
  {
    header: 'Interviewee',
    accessor: 'intervieweeName',
    customCell: Cell,
  },
  {
    header: 'Other Interviewee',
    accessor: 'otherIntervieweeName',
    customCell: Cell,
  },
];

export const actionsColumn = {
  accessor: 'action',
  customCell: ActionCell,
  align: 'right',
};
