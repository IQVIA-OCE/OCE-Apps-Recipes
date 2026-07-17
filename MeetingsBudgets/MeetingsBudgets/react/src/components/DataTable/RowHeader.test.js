import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import RowHeader from './RowHeader';

describe('DataTable/RowHeader', () => {
  test('should render correctly', () => {
    const { getByText } = render(
      <RowHeader>
        <Text>Test title</Text>
      </RowHeader>
    );
    const rowHeader = getByText(/Test title/i);
    expect(rowHeader).toBeTruthy();
  });
});
