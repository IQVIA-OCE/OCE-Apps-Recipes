import React from 'react';
import renderer, { act } from 'react-test-renderer';
import DuplicateModal from './DuplicateModal';
import { Provider, Button } from 'apollo-react-native';

describe('DuplicateModal', () => {
  it('should render component', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <Provider>
          <DuplicateModal
            handleAction={jest.fn()}
            status={'Open'}
            onDismiss={jest.fn()}
          />
        </Provider>
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should submit form', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <Provider>
          <DuplicateModal
            handleAction={jest.fn()}
            status={'Open'}
            onDismiss={jest.fn()}
          />
        </Provider>
      );
    });
    // act(() => tree.root.findAllByType(Button)[0].props.onPress());
    // expect(saveTransactionAsDuplicate).toBeCalled();

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
