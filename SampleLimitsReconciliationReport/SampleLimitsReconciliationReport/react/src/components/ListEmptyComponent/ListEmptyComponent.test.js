import React from 'react';
import { render } from '@testing-library/react-native';
import { ListEmptyComponent } from './ListEmptyComponent';

describe('ListEmptyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <ListEmptyComponent
        loadingStatus={false}
        text={'No data found'}
      />
    );

    expect(getByText(/No data found/i)).toBeTruthy();
  });
});
