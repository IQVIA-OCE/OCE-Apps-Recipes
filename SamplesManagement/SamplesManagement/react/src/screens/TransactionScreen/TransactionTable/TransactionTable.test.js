import React from 'react';
import TransactionTable from './TransactionTable';
import { act, render } from '@testing-library/react-native';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

describe('TransactionTable', () => {
  it('should render component', () => {
    const { getByTestId } = render(
      <TransactionTable
        rows={[]}
        readonly={false}
        form={{values: {recordType: 'Adjustment'}}}
      />
    );
    act(() => jest.runAllTimers());

    expect(getByTestId('TransactionTable')).toBeTruthy();
  });

  it('should render component with different record type', () => {
    const { queryByText } = render(
      <TransactionTable
        rows={[]}
        readonly={false}
        form={{values: {recordType: 'TransferIn'}}}
      />
    );
    act(() => jest.runAllTimers());

    expect(queryByText(/reason/)).toBeNull();
  });
});
