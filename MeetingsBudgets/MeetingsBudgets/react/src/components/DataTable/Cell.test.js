import { render } from '@testing-library/react-native';
import React from 'react';
import Cell from './Cell';

describe('DataTable/Cell', () => {
  test('should render correctly', () => {
    const { getByText } = render(<Cell style={{ width: 100 }}>Test text</Cell>);
    const cellText = getByText(/Test text/i);

    expect(cellText).toBeTruthy();
  });
});
