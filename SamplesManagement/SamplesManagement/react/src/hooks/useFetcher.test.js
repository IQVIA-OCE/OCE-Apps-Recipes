import React from 'react';
import { act } from '@testing-library/react-native';
import { useFetcher } from './useFetcher';
import { testHook } from './testHook';

let fetched;

describe('useFetcher', () => {
  it('should show loaded data', async () => {
    const promise = Promise.resolve();
    const data = [1, 2];
    const fetcher = jest.fn().mockResolvedValue([data]);

    testHook(() => {
      fetched = useFetcher(fetcher, d => d);
    });

    expect(fetched[0].loading).toBe(true);
    await act(() => promise);
    expect(fetched[0].loading).toBe(false);
    expect(fetched[0].data).toBe(data);
  });

  it('should show loaded data without normalizing', async () => {
    const promise = Promise.resolve();
    const data = [1, 2];
    const fetcher = jest.fn().mockResolvedValue([data]);

    testHook(() => {
      fetched = useFetcher(fetcher);
    });
    await act(() => promise);
    expect(fetched[0].data).toBe(data);
  });

  it('should show Error', async () => {
    const promise = Promise.resolve();
    const error = 'error';
    const fetcher = jest.fn().mockRejectedValue(error);

    testHook(() => {
      fetched = useFetcher(fetcher);
    });

    expect(fetched[0].loading).toBe(true);
    await act(() => promise);
    expect(fetched[0].loading).toBe(false);
    expect(fetched[0].error).toBe(error);
  });
});
