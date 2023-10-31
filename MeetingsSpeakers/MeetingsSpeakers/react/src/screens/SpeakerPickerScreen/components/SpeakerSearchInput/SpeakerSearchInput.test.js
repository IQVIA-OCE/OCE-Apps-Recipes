import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SpeakerSearchInput } from './SpeakerSearchInput';

jest.mock('oce-apps-bridges', () => {
  const actualModule = jest.requireActual('oce-apps-bridges');

  return {
    ...actualModule,
    environment: {
      ...actualModule.environment,
      profileId: () => '1'
    }
  }
});

describe('SpeakerSearchInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call onSearch after the user has entered some text', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(<SpeakerSearchInput onSearch={onSearch} />);

    fireEvent.changeText(getByPlaceholderText(/Search.../i), 'test');

    act(() => {
      jest.runAllTimers();
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
