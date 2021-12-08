import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { localized } from '../../../bridge/Localization/localization';
import * as budgetsApi from '../../api/budgetsApi';
import { LOADING_STATUS, NAMESPACE } from '../../constants';
import { mapBudgets, mapMeeting } from './utils/mappers';

export const BUDGETS_LIMIT = 15;

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  meeting: {},
  budgets: [],
  isSystemGeneratedFilterEnabled: true,
  params: {
    limit: BUDGETS_LIMIT,
    offset: 0,
    searchQuery: '',
  },
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budgetPicker/fetchBudgets',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));
      const {
        budgetPicker: { params, meeting, isSystemGeneratedFilterEnabled },
      } = getState();

      if (!(meeting && Object.keys(meeting).length)) return [];

      const [records] = await budgetsApi.fetchBudgets({
        ...params,
        isSystemGeneratedFilterEnabled,
        meeting,
      });

      return mapBudgets(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMoreBudgets = createAsyncThunk(
  'budgetPicker/fetchMoreBudgets',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const {
        budgetPicker: { params, meeting, isSystemGeneratedFilterEnabled },
      } = getState();
      const [records] = await budgetsApi.fetchBudgets({
        ...params,
        isSystemGeneratedFilterEnabled,
        meeting,
        offset: params.offset + BUDGETS_LIMIT,
      });
      dispatch(setOffset(params.offset + BUDGETS_LIMIT));

      return mapBudgets(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveBudget = createAsyncThunk(
  'budgetPicker/saveBudget',
  async (budget, { getState, dispatch, rejectWithValue }) => {
    try {
      const {
        budgetPicker: { meeting },
      } = getState();
      const [response] = await budgetsApi.saveBudget(budget, meeting.id);
      dispatch(removeSelectedBudget(budget));

      return { wasBudgetSaved: Boolean(response) };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const bootstrap = createAsyncThunk(
  'budgetPicker/bootstrap',
  async (parentId, { rejectWithValue }) => {
    try {
      const [[meeting]] = await budgetsApi.fetchMeeting(parentId);

      return meeting && Object.keys(meeting).length
        ? mapMeeting(meeting)
        : // TODO: Add better message from localization
          rejectWithValue({
            message: localized(
              `${NAMESPACE.toLowerCase()}meeting_id_is_not_valid`,
              'Meeting ID is not valid'
            ),
          });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'budgetPicker',
    initialState: _initialState,
    reducers: {
      setOffset: (state, action) => {
        state.params.offset = action.payload;
      },
      setBudgetSearchQuery: (state, action) => {
        state.params.searchQuery = action.payload;
      },
      toggleSystemGeneratedFilter: (state) => {
        state.isSystemGeneratedFilterEnabled =
          !state.isSystemGeneratedFilterEnabled;
      },
      removeSelectedBudget: (state, action) => {
        state.budgets = state.budgets.filter(
          (budget) => budget.id !== action.payload.id
        );
      },
      hideLoader: (state) => {
        state.loadingStatus = LOADING_STATUS.IDLE;
      },
    },
    extraReducers: {
      [fetchBudgets.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchBudgets.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.budgets = action.payload;
      },
      [fetchBudgets.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchMoreBudgets.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
        state.error = null;
      },
      [fetchMoreBudgets.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.budgets = [...state.budgets, ...action.payload];
      },
      [fetchMoreBudgets.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [saveBudget.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.SUBMITTING;
        state.error = null;
      },
      [saveBudget.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [bootstrap.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.IDLE;
        state.meeting = action.payload;
      },
      [bootstrap.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
    },
  });

export const budgetPickerSlice = makeSlice(initialState);

export const {
  setOffset,
  setBudgetSearchQuery,
  toggleSystemGeneratedFilter,
  removeSelectedBudget,
  hideLoader,
} = budgetPickerSlice.actions;

export const budgetPickerReducer = budgetPickerSlice.reducer;
