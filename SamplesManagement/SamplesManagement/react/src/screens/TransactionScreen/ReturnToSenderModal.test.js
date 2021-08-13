import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ReturnToSenderModal from './ReturnToSenderModal';
import { Button, Provider } from 'apollo-react-native';
import { useFetcher, useHandleData, useBoolean } from '../../hooks';

jest.mock('../../hooks');

describe('ReturnToSenderModal', () => {
  beforeAll(() => {
    useFetcher.mockReturnValue([
      { data: [{ id: 'id', label: 'label' }], loading: false },
      { handleFetch: jest.fn() },
    ]);
    useHandleData.mockImplementation(data => fn => fn(data.data));
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });
  it('should render component', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <Provider>
          <ReturnToSenderModal
            handleAction={jest.fn()}
            status={'Open'}
            onDismiss={jest.fn()}
            returnValues={{
              Id: '1',
              fields: { fromSalesRep: { value: '1', id: '1' } },
            }}
          />
        </Provider>
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
