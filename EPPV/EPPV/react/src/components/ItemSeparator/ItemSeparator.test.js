import React from 'react';
import { render } from '@testing-library/react-native';
import { ItemSeparator } from './ItemSeparator';
import { Provider, DarkTheme } from '@oce-apps/apollo-react-native';

describe('Separator', () => {
  it('should render Separator properly', async () => {
    const { getByTestId } = render(<ItemSeparator />);
    expect(getByTestId('itemSeparator')).toBeTruthy();
  });
  it('should render Separator properly in dark mode', async () => {
    const { getByTestId } = render(
      <Provider theme={DarkTheme}>
        <ItemSeparator />
      </Provider>
    );

    expect(getByTestId('itemSeparator')).toBeTruthy();
  });
});
