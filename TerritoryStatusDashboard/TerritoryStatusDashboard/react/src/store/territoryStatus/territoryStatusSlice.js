import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as territoryStatusApi from '../../api/territoryStatusApi';
import { LOADING_STATUS } from '../../constants';

export const initialState = {
  loadingStatus: LOADING_STATUS.IDLE,
  collectedData: {
    totalHCPinTerritory: 0,
    newIndividuals: 0,
    newWorkplaces: 0,
    acceptedChangeRequests: {
      thisPeriod: 0,
      previousPeriod: 0,
    },
    rejectedChangeRequests: {
      thisPeriod: 0,
      previousPeriod: 0,
    },
    newEnrollments: {
      thisPeriod: 0,
      previousPeriod: 0,
    },
    connectRegistration: {
      thisPeriod: 0,
      previousPeriod: 0,
    },
    collectedOpt: {
      thisPeriod: 0,
      previousPeriod: 0,
    },
  },
  error: null,
};

export const bootstrap = createAsyncThunk(
  'territoryStatus/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      let collectedData;

      const [
        [{ number: totalHCPinTerritory }],
        [{ number: newIndividuals }],
        [{ number: newWorkplaces }],
        thisPeriodChangeRequests,
        previousPeriodChangeRequests,
        [{ number: thisPeriodNewEnrollments }],
        [{ number: previousPeriodNewEnrollments }],
        [{ number: thisPeriodConnectRegistration }],
        [{ number: previousPeriodConnectRegistration }],
        [{ number: thisPeriodCollectedOpt }],
        [{ number: previousPeriodCollectedOpt }],
      ] = await Promise.all([
        territoryStatusApi.fetchTerritoryAccounts(true, false),
        territoryStatusApi.fetchTerritoryAccounts(true, true),
        territoryStatusApi.fetchTerritoryAccounts(false, true),
        territoryStatusApi.fetchChangeRequests(false),
        territoryStatusApi.fetchChangeRequests(true),
        territoryStatusApi.fetchNewEnrollments(false),
        territoryStatusApi.fetchNewEnrollments(true),
        territoryStatusApi.fetchConnectRegistration(false),
        territoryStatusApi.fetchConnectRegistration(true),
        territoryStatusApi.fetchCollectedOpt(false),
        territoryStatusApi.fetchCollectedOpt(true),
      ]);

      collectedData = {
        totalHCPinTerritory: totalHCPinTerritory,
        newIndividuals: newIndividuals,
        newWorkplaces: newWorkplaces,
        acceptedChangeRequests: {
          thisPeriod: thisPeriodChangeRequests.find(el => el.status === 'Approved')?.number ?? 0,
          previousPeriod: previousPeriodChangeRequests.find(el => el.status === 'Approved')?.number ?? 0,
        },
        rejectedChangeRequests: {
          thisPeriod: thisPeriodChangeRequests.find(el => el.status === 'Rejected')?.number ?? 0,
          previousPeriod: previousPeriodChangeRequests.find(el => el.status === 'Rejected')?.number ?? 0,
        },
        newEnrollments: {
          thisPeriod: thisPeriodNewEnrollments,
          previousPeriod: previousPeriodNewEnrollments,
        },
        connectRegistration: {
          thisPeriod: thisPeriodConnectRegistration,
          previousPeriod: previousPeriodConnectRegistration,
        },
        collectedOpt: {
          thisPeriod: thisPeriodCollectedOpt,
          previousPeriod: previousPeriodCollectedOpt,
        },
      };

      return collectedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'territoryStatus',
    initialState: _initialState,
    reducers: {},
    extraReducers: {
      [bootstrap.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [bootstrap.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.collectedData = action.payload;
      },
      [bootstrap.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error;
      },
    },
  });

export const territoryStatusSlice = makeSlice(initialState);

export const territoryStatusReducer = territoryStatusSlice.reducer;
