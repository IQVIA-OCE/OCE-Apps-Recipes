import React from 'react';
import renderer, { act } from 'react-test-renderer';
import TransactionTable from './TransactionTable';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

describe('TransactionTable', () => {
  it('should render component', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <TransactionTable
          rows={[]}
          readonly={false}
          form={{values: {recordType: 'Adjustment'}}}
        />
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should render component with different record type', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <TransactionTable
          rows={[]}
          readonly={false}
          form={{values: {recordType: 'TransferIn'}}}
        />
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
