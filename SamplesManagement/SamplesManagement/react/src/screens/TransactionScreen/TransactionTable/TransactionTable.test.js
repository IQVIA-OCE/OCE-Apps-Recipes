import React from 'react';
import TransactionTable from './TransactionTable';
import { render } from '@testing-library/react-native';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

describe('TransactionTable', () => {
  it('should render component', async () => {
    const { getByTestId } = render(
      <TransactionTable
        rows={[]}
        readonly={false}
        form={{values: {recordType: 'Adjustment'}}}
      />
    );

    expect(getByTestId('TransactionTable')).toBeTruthy();
  });

  it('should render component with different record type', async () => {
    const { queryByText } = render(
      <TransactionTable
        rows={[]}
        readonly={false}
        form={{values: {recordType: 'TransferIn'}}}
      />
    )

    expect(queryByText(/reason/)).toBeNull();
  });
});
