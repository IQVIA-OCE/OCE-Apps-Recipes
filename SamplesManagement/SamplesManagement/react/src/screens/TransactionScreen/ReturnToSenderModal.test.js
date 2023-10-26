import React from 'react';
import ReturnToSenderModal from './ReturnToSenderModal';
import {Provider, Select} from 'apollo-react-native';
import { useFetcher, useHandleData, useBoolean } from '../../hooks';
import {render, waitFor} from "@testing-library/react-native";

jest.mock('../../hooks');

describe('ReturnToSenderModal', () => {
  beforeAll(() => {
    useFetcher.mockReturnValue([
      { data: [{ id: 'id', label: 'testLabel' }], loading: false },
      { handleFetch: jest.fn() },
    ]);
    useHandleData.mockImplementation(data => fn => fn(data.data));
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });

  it('should render component', async () => {
    const { container } = render(
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

    await waitFor(() => {
      expect(container.findByType(Select).props.options).toEqual([{ id: 'id', label: 'testLabel' }])
    })
  });
});
