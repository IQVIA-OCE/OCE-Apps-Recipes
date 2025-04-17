import React from 'react';
import Loader from './Loader';
import { render } from '@testing-library/react-native';
import { act } from '@testing-library/react-native';

describe('Loader', () => {
  it('Should render Loader', () => {
    const { getByTestId } = render(<Loader />);

    expect(getByTestId('Loader')).toBeTruthy();
    act(() => jest.runAllTimers());
  });
});
