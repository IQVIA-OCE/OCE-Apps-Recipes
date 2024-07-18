import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SearchInput } from './SearchInput';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}))

describe('SearchInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call onSearch after the user has entered some text', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput onSearch={onSearch} />
    );

    fireEvent.changeText(getByPlaceholderText(/Search Account.../i), 'test');

    act(() => {
      jest.runAllTimers();
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
