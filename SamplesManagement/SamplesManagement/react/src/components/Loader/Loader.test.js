import Loader from './Loader';
import React from 'react';
import { render } from '@testing-library/react-native';

describe('Loader', () => {
  it('Should render Loader', () => {
    const { getByTestId } = render(<Loader />);

    expect(getByTestId('Loader')).toBeTruthy();
  });
});
