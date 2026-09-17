import { configureStore } from '@reduxjs/toolkit';
import * as territoryStatusApi from '../../api/territoryStatusApi';
import { LOADING_STATUS } from '../../constants';
import { COLLECTED_DATA, getChangeRequestsMockData } from '../../mocks/territoryStatusTestData';
import { bootstrap, initialState, makeSlice, territoryStatusReducer } from './territoryStatusSlice';

jest.mock('../../api/territoryStatusApi', () => ({
  fetchTerritoryAccounts: jest.fn(),
  fetchChangeRequests: jest.fn(),
  fetchNewEnrollments: jest.fn(),
  fetchConnectRegistration: jest.fn(),
  fetchCollectedOpt: jest.fn(),
}));

const getCountDataObj = (number) => ([{ number: number }]);

describe('territoryStatusSlice', () => {
  describe('asyncThunk', () => {
    beforeEach(() => {
      territoryStatusApi.fetchTerritoryAccounts.mockReset();
      territoryStatusApi.fetchChangeRequests.mockReset();
      territoryStatusApi.fetchNewEnrollments.mockReset();
      territoryStatusApi.fetchConnectRegistration.mockReset();
      territoryStatusApi.fetchCollectedOpt.mockReset();
    });

    test('bootstrap asyncThunk: should return collected data', async () => {
      territoryStatusApi.fetchTerritoryAccounts
        .mockResolvedValueOnce(getCountDataObj(100))
        .mockResolvedValueOnce(getCountDataObj(1))
        .mockResolvedValueOnce(getCountDataObj(2));
      territoryStatusApi.fetchChangeRequests
        .mockResolvedValueOnce(getChangeRequestsMockData(1, 2))
        .mockResolvedValueOnce(getChangeRequestsMockData(3, 4));
      territoryStatusApi.fetchNewEnrollments
        .mockResolvedValueOnce(getCountDataObj(1))
        .mockResolvedValueOnce(getCountDataObj(2));
      territoryStatusApi.fetchConnectRegistration
        .mockResolvedValueOnce(getCountDataObj(3))
        .mockResolvedValueOnce(getCountDataObj(4));
      territoryStatusApi.fetchCollectedOpt
        .mockResolvedValueOnce(getCountDataObj(5))
        .mockResolvedValueOnce(getCountDataObj(6));

      const slice = makeSlice(initialState);
      const store = configureStore({
        reducer: {
          territoryStatus: slice.reducer,
        },
      });

      await store.dispatch(bootstrap());

      expect(territoryStatusApi.fetchTerritoryAccounts.mock.calls.length).toBe(3);
      expect(territoryStatusApi.fetchChangeRequests.mock.calls.length).toBe(2);
      expect(territoryStatusApi.fetchNewEnrollments.mock.calls.length).toBe(2);
      expect(territoryStatusApi.fetchConnectRegistration.mock.calls.length).toBe(2);
      expect(territoryStatusApi.fetchCollectedOpt.mock.calls.length).toBe(2);
      expect(store.getState().territoryStatus.collectedData).toStrictEqual(COLLECTED_DATA);
    });

    test('bootstrap asyncThunk: should return collected data when change request are empty', async () => {
      territoryStatusApi.fetchTerritoryAccounts
        .mockResolvedValueOnce(getCountDataObj(100))
        .mockResolvedValueOnce(getCountDataObj(1))
        .mockResolvedValueOnce(getCountDataObj(2));
      territoryStatusApi.fetchChangeRequests
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      territoryStatusApi.fetchNewEnrollments
        .mockResolvedValueOnce(getCountDataObj(1))
        .mockResolvedValueOnce(getCountDataObj(2));
      territoryStatusApi.fetchConnectRegistration
        .mockResolvedValueOnce(getCountDataObj(3))
        .mockResolvedValueOnce(getCountDataObj(4));
      territoryStatusApi.fetchCollectedOpt
        .mockResolvedValueOnce(getCountDataObj(5))
        .mockResolvedValueOnce(getCountDataObj(6));

      const slice = makeSlice(initialState);
      const store = configureStore({
        reducer: {
          territoryStatus: slice.reducer,
        },
      });

      await store.dispatch(bootstrap());

      expect(territoryStatusApi.fetchTerritoryAccounts.mock.calls.length).toBe(3);
      expect(territoryStatusApi.fetchChangeRequests.mock.calls.length).toBe(2);
      expect(territoryStatusApi.fetchNewEnrollments.mock.calls.length).toBe(2);
      expect(territoryStatusApi.fetchConnectRegistration.mock.calls.length).toBe(2);
      expect(territoryStatusApi.fetchCollectedOpt.mock.calls.length).toBe(2);
      expect(store.getState().territoryStatus.collectedData).toStrictEqual({
        ...COLLECTED_DATA,
        acceptedChangeRequests: {
          thisPeriod: 0,
          previousPeriod: 0,
        },
        rejectedChangeRequests: {
          thisPeriod: 0,
          previousPeriod: 0,
        },
      });
    });

    test('bootstrap asyncThunk: should return error if API returns error', async () => {
      territoryStatusApi.fetchTerritoryAccounts.mockRejectedValueOnce({ message: 'Rejected' });

      const slice = makeSlice(initialState);
      const store = configureStore({
        reducer: {
          territoryStatus: slice.reducer,
        },
      });

      await store.dispatch(bootstrap());

      expect(territoryStatusApi.fetchTerritoryAccounts).toHaveBeenCalled();
      expect(store.getState().territoryStatus.collectedData).toStrictEqual(initialState.collectedData);
      expect(store.getState().territoryStatus.error).toStrictEqual({ message: 'Rejected' });
    });
  });

  describe('extraReducers', () => {
    let state;

    beforeEach(() => {
      state = initialState;
    });

    test('bootstrap.pending', () => {
      const newState = territoryStatusReducer(
        state,
        bootstrap.pending('', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });

    test('bootstrap.fulfilled', () => {
      const newState = territoryStatusReducer(
        state,
        bootstrap.fulfilled(COLLECTED_DATA, '', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.collectedData).toStrictEqual(COLLECTED_DATA);
    });

    test('bootstrap.rejected', () => {
      const newState = territoryStatusReducer(
        state,
        bootstrap.rejected(null, '', () => {}, 'Rejected', {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toStrictEqual({ message: 'Rejected' });
    });
  });
});
