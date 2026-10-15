import React from 'react';
import Card from './Card';
import { render } from '@testing-library/react-native';

describe('Card', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Card
        icon="folder"
        title="test_title"
        count="0"
      />
    );

    expect(getByText(/test_title/)).toBeTruthy();
  });
});
