import React from 'react';
import ReturnToSenderModal from './ReturnToSenderModal';
import { Provider, Select } from '@oce-apps/apollo-react-native';
import { useBoolean } from '../../hooks';
import { render, act } from '@testing-library/react-native';
import { fetchUserLocations } from '../../api/SampleTransaction';

jest.mock('../../hooks/useBoolean');

describe('ReturnToSenderModal', () => {
  beforeAll(() => {
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });

  it('should render component', () => {
    fetchUserLocations.mockResolvedValue([
      [{ Id: 'id', OCE__FullAddress__c: 'testLabel'}],
      { totalSize: 2, done: true },
    ]);
    const { UNSAFE_root } = render(
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
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(Select).props.options).toEqual([
      { id: 'id', label: 'testLabel' },
    ]);
  });
});
