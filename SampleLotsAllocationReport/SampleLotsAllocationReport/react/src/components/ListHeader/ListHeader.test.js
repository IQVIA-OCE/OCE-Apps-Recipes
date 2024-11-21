import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ListHeader } from "./ListHeader";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
    userId: () => ''
  },
}))

const testTitles = [
  { title: 'test 1', fieldName: 'test 1', sortField: 'test1' },
  { title: 'test 2', fieldName: 'test 2', sortField: 'test2' },
  { title: 'test 3', fieldName: 'test 3', sortField: 'test3' },
];

describe('ListHeader', () => {
  it('should render ListHeader component', () => {

    const { getByText } = render(
      <ListHeader titles={testTitles} />
    );

    expect(getByText('test 1')).toBeTruthy();
  });

  it('should tap on header to sort down the list', () => {
    const onSort = jest.fn();
    const { getByTestId, getAllByTestId } = render(
      <ListHeader titles={testTitles} onSort={onSort} />
    );
    fireEvent.press(getByTestId('sortColumn_0'));
    expect(getByTestId('sortIcon_0')).toBeTruthy();
  });
});
