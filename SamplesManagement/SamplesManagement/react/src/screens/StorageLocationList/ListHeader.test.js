import React from 'react';
import ListHeader from './ListHeader';
import { render } from '@testing-library/react-native';

describe('ListHeader', () => {
  it('Should render ListHeader component', () => {
    const { getByText } = render(
      <ListHeader />
    );

    expect(getByText('ADDRESS')).toBeTruthy();
    expect(getByText('DEFAULT STORAGE LOCATION')).toBeTruthy();
  });
});
