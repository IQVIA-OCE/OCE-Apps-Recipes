import { render } from '@testing-library/react-native';
import React from 'react';
import * as utilsCommon from '../utils/common';
import { CustomTable } from './CustomTable';

const COLUMNS_MOCK = [
  {
    header: 'Name',
    accessor: 'name',
    sortFunction: jest.fn(),
  },
  {
    header: 'Age',
    accessor: 'age',
    sortFunction: jest.fn(),
  },
];

const ROWS_MOCK = [
  {
    name: 'John Dou',
    age: 30,
  },
  {
    name: 'Mari Smith',
    age: 25,
  },
];

describe('CustomTable', () => {
  test('should render properly', () => {
    utilsCommon.isIphone = false;
    const { getByText } = render(
      <CustomTable
        title="Test custom table"
        totalSize={10}
        columns={COLUMNS_MOCK}
        rows={ROWS_MOCK}
        initialSortedColumn="name"
        initialSortOrder="ascending"
        columnWidth={['auto', 'auto']}
        hidePagination={false}
        icon="file-document"
        onPressButton={jest.fn()}
        disableButton={false}
      />
    );

    expect(getByText(/Test custom table/i)).toBeTruthy();
    expect(getByText(/John Dou/i)).toBeTruthy();
    expect(getByText(/30/i)).toBeTruthy();
  });

  test('should render properly for iPhone', () => {
    utilsCommon.isIphone = true;
    const { getByText } = render(
      <CustomTable
        title="Test custom table"
        totalSize={10}
        columns={COLUMNS_MOCK}
        rows={ROWS_MOCK}
        initialSortedColumn="name"
        initialSortOrder="ascending"
        columnWidth={['auto', 'auto']}
        hidePagination={false}
        icon="file-document"
        onPressButton={jest.fn()}
        disableButton={false}
      />
    );

    expect(getByText(/Test custom table/i)).toBeTruthy();
    expect(getByText(/John Dou/i)).toBeTruthy();
    expect(getByText(/30/i)).toBeTruthy();
  });
});
