import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ColumnTitle from "./ColumnTitle";
import DataTable from './DataTable';

const ITEMS = [
  {
    name: 'Test name 1',
    status: 'active',
    date: '2021-05-12',
  },
  {
    name: 'Test name 2',
    status: 'active',
    date: '2021-05-12',
  },
  {
    name: 'Test name 3',
    status: 'active',
    date: '2021-05-12',
  },
];

const COLUMNS = [
  {
    header: 'Name',
    accessor: 'name',
    sortFunction: null,
  },
  {
    header: 'Status',
    accessor: 'status',
    sortFunction: null,
  },
  {
    header: 'Date',
    accessor: 'date',
    sortFunction: null,
    isDate: true,
  },
];

const COLUMN_WIDTH = [100, 100, 100];

describe('DataTable', () => {
  test('should render correctly', () => {
    const { getByTestId } = render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        phoneSortedColumn="name"
        columnWidth={COLUMN_WIDTH}
        horizontalScroll={true}
      />
    );
    const dataTableContainer = getByTestId('dataTable-container');

    expect(dataTableContainer).toBeTruthy();
  });

  test('should render table without horizontal scroll when horizontalScroll is false', () => {
    const { getByTestId } = render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        phoneSortedColumn="name"
        columnWidth={COLUMN_WIDTH}
      />
    );
    const dataTableContainer = getByTestId('dataTable-container');
    let dataTableHorizontalScroll;
    try {
      dataTableHorizontalScroll = getByTestId('dataTable-horizontalScroll');
    } catch (e) {
      dataTableHorizontalScroll = null;
    }

    expect(dataTableHorizontalScroll).toBeFalsy();
    expect(dataTableContainer).toBeTruthy();
  });

  test('should render default empty component if there are no rows', () => {
    const { getByText } = render(
      <DataTable
        columns={COLUMNS}
        rows={[]}
        columnWidth={COLUMN_WIDTH}
        horizontalScroll={true}
      />
    );
    const dataTableContainer = getByText(/There is nothing to display/i);

    expect(dataTableContainer).toBeTruthy();
  });

  test('should render RowPhone if verticalRow prop is true', () => {
    const { getAllByText } = render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        phoneSortedColumn="name"
        columnWidth={COLUMN_WIDTH}
        verticalRow={true}
      />
    );
    const rowPhone = getAllByText(/Test name/i);

    expect(rowPhone.length).toEqual(3);
  });

  test('should call activeSortColumn sortFunction when rows are changed', () => {
    COLUMNS[0].sortFunction = jest.fn();
    render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        columnWidth={COLUMN_WIDTH}
        horizontalScroll={true}
      />
    );

    expect(COLUMNS[0].sortFunction).toHaveBeenCalled();
    expect(COLUMNS[0].sortFunction).toHaveBeenNthCalledWith(1, 'name', 'ascending', ITEMS[1], ITEMS[0]);
  });

  test('should activeSortColumn sortFunction when ColumnTitle is pressed', () => {
    COLUMNS[1].sortFunction = jest.fn();
    const { getByText } = render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        phoneSortedColumn="name"
        columnWidth={COLUMN_WIDTH}
        horizontalScroll={true}
      />
    );
    const columnTitle = getByText(/Status/i);

    fireEvent.press(columnTitle);

    expect(COLUMNS[1].sortFunction).toHaveBeenCalled();
    expect(COLUMNS[1].sortFunction).toHaveBeenNthCalledWith(1, 'status', 'ascending', ITEMS[1], ITEMS[0]);
  });

  test('should ColumnTitle width "auto" if columnWidth is not passed', () => {
    const { UNSAFE_queryAllByType } = render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        phoneSortedColumn="name"
        horizontalScroll={true}
      />
    );
    const columnTitles = UNSAFE_queryAllByType(ColumnTitle);

    columnTitles.forEach(title => {
      expect(title.props.style.width).toBe('auto');
    })
  });

  test('should render only one ColumnTitle if verticalRow and phoneSortedColumn are passed', () => {
    const { UNSAFE_queryAllByType } = render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        columnWidth={COLUMN_WIDTH}
        phoneSortedColumn="name"
        verticalRow={true}
        horizontalScroll={false}
      />
    );
    const columnTitles = UNSAFE_queryAllByType(ColumnTitle);

    expect(columnTitles.length).toEqual(1);
  });
  test('should pass sortOrder null to ColumnTitle on phones if initialSortedColumn not equal phoneSortedColumn', () => {
    const { UNSAFE_queryAllByType } = render(
      <DataTable
        columns={COLUMNS}
        rows={ITEMS}
        columnWidth={COLUMN_WIDTH}
        phoneSortedColumn="name"
        initialSortedColumn="status"
        verticalRow={true}
        horizontalScroll={false}
      />
    );
    const columnTitles = UNSAFE_queryAllByType(ColumnTitle);

    expect(columnTitles[0].props.sortOrder).toBeNull();
  });
});
