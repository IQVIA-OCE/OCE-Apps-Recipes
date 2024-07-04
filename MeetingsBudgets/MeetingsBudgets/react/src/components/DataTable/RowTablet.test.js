import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as dateTimeFormat from '../../utils/dateTimeFormat';
import Cell from "./Cell";
import RowTablet from './RowTablet';

const ITEM = {
  name: 'Test name',
  status: 'active',
  date: '2021-05-12',
};

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

describe('DataTable/RowTablet', () => {
  test('should render correctly', () => {
    const { getByTestId } = render(
      <RowTablet item={ITEM} columns={COLUMNS} columnWidth={COLUMN_WIDTH} />
    );
    const rowTablet = getByTestId('rowTablet');

    expect(rowTablet).toBeTruthy();
  });

  test('should call onRowPress prop', () => {
    const onRowPress = jest.fn();
    const { getByTestId } = render(
      <RowTablet
        item={ITEM}
        columns={COLUMNS}
        columnWidth={COLUMN_WIDTH}
        onRowPress={onRowPress}
      />
    );
    const rowTabletTouchable = getByTestId('rowTablet-touchable');

    fireEvent.press(rowTabletTouchable);

    expect(onRowPress).toHaveBeenCalled();
    expect(onRowPress).toHaveBeenCalledWith(ITEM);
  });

  test('should call formatDate if field has date', () => {
    const formatDateSpyOn = jest.spyOn(dateTimeFormat, 'formatDate');
    render(
      <RowTablet item={ITEM} columns={COLUMNS} columnWidth={COLUMN_WIDTH} />
    );

    expect(formatDateSpyOn).toHaveBeenCalled();
    expect(formatDateSpyOn).toHaveBeenCalledWith(ITEM.date);
  });

  test('should set cell width "auto" if columnWidth does not have width for this cell', () => {
    const { UNSAFE_queryAllByType } = render(
      <RowTablet item={ITEM} columns={COLUMNS} columnWidth={[]} />
    );
    const cells = UNSAFE_queryAllByType(Cell);

    cells.forEach(cell => {
      expect(cell.props.style.width).toBe('auto');
    })
  });
});
