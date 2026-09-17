import React from 'react';
import Info from './Info';
import { AppContext } from '../../AppContext';
import { act, render } from '@testing-library/react-native';
import { fetchUsers } from '../../api/StorageLocation';

const context = {
  username: 'test user name',
  userId: '1',
};

describe('StorageLocation Info', () => {
  it('Should render Info component user data', () => {
    const { getByText } = render(
      <AppContext.Provider value={context}>
        <Info
          values={{
            createdById: '1',
            modifiedById: '1',
            createdDate: 'created date',
            modifiedDate: 'modified date',
          }}
        />
      </AppContext.Provider>,
    );

    act(() => jest.runAllTimers());
    expect(getByText(/test user name created date/i)).toBeTruthy();
  });

  it('Should render Info component other data', () => {
    fetchUsers.mockResolvedValueOnce([
      [{
        'Id': '2', 'Name': 'Second user',
      }]],
    );

    const { getByText } = render(
      <AppContext.Provider value={context}>
        <Info
          values={{
            createdById: '2',
            modifiedById: '2',
            createdDate: 'created date',
            modifiedDate: 'modified date',
          }}
        />
      </AppContext.Provider>,
    );

    act(() => jest.runAllTimers());
    expect(getByText(/Second user created date/i)).toBeTruthy();
  });
});
