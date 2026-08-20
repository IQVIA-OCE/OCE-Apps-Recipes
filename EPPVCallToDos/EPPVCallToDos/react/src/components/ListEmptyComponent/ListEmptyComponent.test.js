import React from 'react';
import { render } from '@testing-library/react-native';
import { ListEmptyComponent } from './ListEmptyComponent';

describe('List Empty Component', () => {
  it('should render ListEmptyComponent properly', async () => {
    const { getByTestId } = render(<ListEmptyComponent />);
    expect(getByTestId('listEmptyComponent')).toBeTruthy();
  });
  it('should render ListEmptyComponent properly with loading status', async () => {
    const { getByTestId } = render(<ListEmptyComponent isLoading={true}/>);
    expect(getByTestId('listEmptyComponent')).toBeTruthy();
  });

});
