import { render } from '@testing-library/react-native';
import React from 'react';
import Header from './Header';

describe('Header', () => {
  it('should render properly', () => {
    const { queryByText } = render(<Header />);

    expect(queryByText(/Call Details History/)).toBeTruthy();
  });
});
