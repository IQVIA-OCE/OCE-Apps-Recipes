import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ColumnTitle from './ColumnTitle';

describe('DataTable/ColumnTitle', () => {
  test('should render correctly', () => {
    const { getByText } = render(
      <ColumnTitle columnIndex={0} sortOrder={null} style={{ width: 'auto' }}>
        Test header
      </ColumnTitle>
    );
    const columnTitleText = getByText(/Test header/i);

    expect(columnTitleText).toBeTruthy();
  });

  test('should call onSortColumn prop', () => {
    const onSortColumn = jest.fn();
    const { getByTestId } = render(
      <ColumnTitle
        columnIndex={0}
        sortOrder={'descending'}
        style={{ width: 'auto' }}
        onSortColumn={onSortColumn}
      >
        Test header
      </ColumnTitle>
    );
    const columnTitleTouchable = getByTestId('columnTitle-touchable');

    fireEvent.press(columnTitleTouchable);

    expect(onSortColumn).toHaveBeenCalled();
    expect(onSortColumn).toHaveBeenCalledWith(0, 'descending');
  });

  describe('should render icon correctly', () => {
    test('if sortOrder is unset', () => {
      expect(getColumnTitleIcon(null).props.children[0]).toBeFalsy();
    });

    test('if sortOrder set as "ascending"', () => {
      expect(getColumnTitleIcon('ascending').props.children[0]).toBeTruthy();
    });

    test('if sortOrder set as "descending"', () => {
      expect(getColumnTitleIcon('descending').props.children[0]).toBeTruthy();
    });
  });
});

function getColumnTitleIcon(sortOrder) {
  const { getByTestId } = render(
    <ColumnTitle
      columnIndex={0}
      sortOrder={sortOrder}
      style={{ width: 'auto' }}
    >
      Test header
    </ColumnTitle>
  );
  return getByTestId('columnTitle-icon');
}
