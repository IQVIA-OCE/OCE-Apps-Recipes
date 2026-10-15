import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as dateTimeFormat from '../../utils/dateTimeFormat';
import RowPhone from './RowPhone';

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

describe('DataTable/RowPhone', () => {
  test('should render correctly', () => {
    const { getByTestId } = render(
      <RowPhone item={ITEM} columns={COLUMNS} phoneSortedColumn={'name'} />
    );
    const rowPhone = getByTestId('rowPhone');

    expect(rowPhone).toBeTruthy();
  });

  test('should call onRowPress prop', () => {
    const onRowPress = jest.fn();
    const { getByTestId } = render(
      <RowPhone
        item={ITEM}
        columns={COLUMNS}
        phoneSortedColumn={'name'}
        onRowPress={onRowPress}
      />
    );
    const rowPhoneTouchable = getByTestId('rowPhone-touchable');

    fireEvent.press(rowPhoneTouchable);

    expect(onRowPress).toHaveBeenCalled();
    expect(onRowPress).toHaveBeenCalledWith(ITEM);
  });

  test('should call formatDate if field has date', () => {
    const formatDateSpyOn = jest.spyOn(dateTimeFormat, 'formatDate');
    render(
      <RowPhone item={ITEM} columns={COLUMNS} phoneSortedColumn={'name'} />
    );

    expect(formatDateSpyOn).toHaveBeenCalled();
    expect(formatDateSpyOn).toHaveBeenCalledWith(ITEM.date);
  });
});
