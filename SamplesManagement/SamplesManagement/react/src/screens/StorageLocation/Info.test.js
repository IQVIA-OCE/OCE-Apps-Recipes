import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Info from './Info';
import { AppContext } from '../../../AppContext';
import { useFetcher, useHandleData } from '../../hooks';

jest.mock('../../hooks/index');

const context = {
  username: 'test user name',
  userId: '1',
};

describe('StorageLocation Info', () => {
  beforeAll(() => {
    useFetcher.mockImplementation((fetch, normalizer) => {
      return [
        {
          loading: false,
          data: {
            '2': 'Second user',
          },
        },
      ]
    });
    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });

  it('Should render Info component user data', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={context}>
        <Info
          values={{
            createdById: '1',
            modifiedById: '1',
            createdDate: 'created date',
            modifiedDate: 'modified date',
          }}
        />
      </AppContext.Provider>
    );
    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render Info component other data', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={context}>
        <Info
          values={{
            createdById: '2',
            modifiedById: '2',
            createdDate: 'created date',
            modifiedDate: 'modified date',
          }}
        />
      </AppContext.Provider>
    );
    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
