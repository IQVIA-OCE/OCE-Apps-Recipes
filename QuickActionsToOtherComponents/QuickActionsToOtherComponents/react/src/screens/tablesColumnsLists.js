import { ActionCell } from '../components/ActionCell';
import { DateCell } from '../components/DateCell';
import { sortDates, sortNumbers, sortStrings } from '../utils';

export const ORDER_COLUMNS = [
  {
    header: 'Order2 Name',
    accessor: 'name',
    sortFunction: sortStrings,
    customCell: (props) => <ActionCell {...props} />,
  },
  {
    header: 'Order Date',
    accessor: 'date',
    sortFunction: sortDates,
    customCell: DateCell,
  },
  {
    header: 'Type / Sub-Type',
    accessor: 'typeAndSubtype',
    sortFunction: sortStrings,
  },
  {
    header: 'Net Amount',
    accessor: 'netAmount',
    sortFunction: sortNumbers,
  },
  {
    header: 'Status',
    accessor: 'status',
    sortFunction: sortStrings,
  },
];

export const INQUIRY_COLUMNS = [
  {
    header: 'Inquiry Name',
    accessor: 'name',
    sortFunction: sortStrings,
    customCell: (props) => <ActionCell {...props} />,
  },
  {
    header: 'Account',
    accessor: 'account',
    sortFunction: sortStrings,
  },
  {
    header: 'Inquiry Type',
    accessor: 'type',
    sortFunction: sortStrings,
  },
  {
    header: 'Priority',
    accessor: 'priority',
    sortFunction: sortStrings,
  },
  {
    header: 'Response Preference',
    accessor: 'responsePreference',
    sortFunction: sortStrings,
  },
];

export const STORE_CHECK_COLUMNS = [
  {
    header: 'Store Check (Name)',
    accessor: 'name',
    sortFunction: sortStrings,
    customCell: (props) => <ActionCell {...props} />,
  },
  {
    header: 'Date & Time',
    accessor: 'dateTime',
    sortFunction: sortDates,
    customCell: DateCell,
  },
  {
    header: 'Status',
    accessor: 'status',
    sortFunction: sortStrings,
  },
];

export const CALL_COLUMNS = [
  {
    header: 'Call Name',
    accessor: 'name',
    sortFunction: sortStrings,
    customCell: (props) => <ActionCell {...props} />,
  },
  {
    header: 'Account',
    accessor: 'account',
    sortFunction: sortStrings,
  },
  {
    header: 'Call Date & Time',
    accessor: 'dateTime',
    sortFunction: sortDates,
    customCell: DateCell,
  },
  {
    header: 'Channel',
    accessor: 'channel',
    sortFunction: sortStrings,
  },
  {
    header: 'Status',
    accessor: 'status',
    sortFunction: sortStrings,
  },
];
