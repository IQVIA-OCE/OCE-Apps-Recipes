import { configureStore } from '@reduxjs/toolkit';
import * as budgetsApi from '../../api/budgetsApi';
import {
  LOADING_STATUS,
  MAPPED_BUDGETS_DATA,
  MAPPED_MEETING_DATA,
  ORIGINAL_BUDGETS_DATA,
  ORIGINAL_MEETING_DATA,
} from '../../constants';
import {
  bootstrap,
  budgetPickerReducer,
  BUDGETS_LIMIT,
  fetchBudgets,
  fetchMoreBudgets,
  hideLoader,
  initialState,
  makeSlice,
  removeSelectedBudget,
  saveBudget,
  setBudgetSearchQuery,
  setOffset,
  toggleSystemGeneratedFilter,
} from './budgetPickerSlice';

jest.mock('../../../bridge/Database/DatabaseManager', () => ({
  databaseManager: {
    upsert: jest.fn(),
  },
}));
jest.mock('../../../bridge/EnvironmentData/EnvironmentData', () => ({
  environment: {
    namespace: () => 'OCE__',
    userID: () => '1',
    sfApiVersion: () => '1',
    locale: () => 'en_US',
  },
}));
jest.mock('../../api/budgetsApi', () => ({
  fetchBudgets: jest.fn(),
  fetchMeeting: jest.fn(),
  saveBudget: jest.fn(),
}));

describe('budgetPickerSlice', () => {
  describe('asyncThunk', () => {
    beforeEach(() => {
      budgetsApi.fetchBudgets.mockReset();
      budgetsApi.fetchMeeting.mockReset();
      budgetsApi.saveBudget.mockReset();
    });

    describe('fetchBudgets asyncThunk', () => {
      test('should return array of budgets if meeting is valid', async () => {
        budgetsApi.fetchBudgets.mockResolvedValueOnce([ORIGINAL_BUDGETS_DATA]);

        const slice = makeSlice({
          ...initialState,
          meeting: MAPPED_MEETING_DATA,
        });
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchBudgets());

        expect(budgetsApi.fetchBudgets).toHaveBeenCalled();
        expect(store.getState().budgetPicker.budgets.length).toBe(
          ORIGINAL_BUDGETS_DATA.length
        );
      });

      test('should return empty array if meeting is not valid', async () => {
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchBudgets());

        expect(budgetsApi.fetchBudgets).not.toHaveBeenCalled();
        expect(store.getState().budgetPicker.budgets.length).toBe(0);
      });

      test('should return error if API returns error', async () => {
        budgetsApi.fetchBudgets.mockRejectedValueOnce(new Error('Test error'));

        const slice = makeSlice({
          ...initialState,
          meeting: MAPPED_MEETING_DATA,
        });
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchBudgets());

        expect(budgetsApi.fetchBudgets).toHaveBeenCalled();
        expect(store.getState().budgetPicker.budgets.length).toBe(0);
        expect(store.getState().budgetPicker.error).toBe('Rejected');
      });
    });

    describe('fetchMoreBudgets asyncThunk', () => {
      test('should return array of budgets with new elements', async () => {
        budgetsApi.fetchBudgets.mockResolvedValueOnce([ORIGINAL_BUDGETS_DATA]);

        const slice = makeSlice({
          ...initialState,
          meeting: MAPPED_MEETING_DATA,
          budgets: MAPPED_BUDGETS_DATA,
        });
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchMoreBudgets());

        expect(budgetsApi.fetchBudgets).toHaveBeenCalled();
        expect(store.getState().budgetPicker.budgets.length).toBe(
          MAPPED_BUDGETS_DATA.length + ORIGINAL_BUDGETS_DATA.length
        );
      });

      test('should return error if API returns error', async () => {
        budgetsApi.fetchBudgets.mockRejectedValueOnce(new Error('Test error'));

        const slice = makeSlice({
          ...initialState,
          meeting: MAPPED_MEETING_DATA,
          budgets: MAPPED_BUDGETS_DATA,
        });
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchMoreBudgets());

        expect(budgetsApi.fetchBudgets).toHaveBeenCalled();
        expect(store.getState().budgetPicker.budgets.length).toBe(
          MAPPED_BUDGETS_DATA.length
        );
        expect(store.getState().budgetPicker.error).toBe('Rejected');
      });
    });

    describe('saveBudget asyncThunk', () => {
      test('should save budget and remove it from budgets array in store', async () => {
        budgetsApi.saveBudget.mockResolvedValueOnce(['some_id_from_API']);

        const slice = makeSlice({
          ...initialState,
          meeting: MAPPED_MEETING_DATA,
          budgets: MAPPED_BUDGETS_DATA,
        });
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(saveBudget(MAPPED_BUDGETS_DATA[0]));

        expect(budgetsApi.saveBudget).toHaveBeenCalled();
        expect(budgetsApi.saveBudget).toHaveBeenCalledWith(
          MAPPED_BUDGETS_DATA[0],
          MAPPED_MEETING_DATA.id
        );
        expect(store.getState().budgetPicker.budgets.length).toBe(
          MAPPED_BUDGETS_DATA.length - 1
        );
      });

      test('should return error if API returns error', async () => {
        budgetsApi.saveBudget.mockRejectedValueOnce(new Error('Test error'));

        const slice = makeSlice({
          ...initialState,
          meeting: MAPPED_MEETING_DATA,
          budgets: MAPPED_BUDGETS_DATA,
        });
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(saveBudget(MAPPED_BUDGETS_DATA[0]));

        expect(budgetsApi.saveBudget).toHaveBeenCalled();
        expect(budgetsApi.saveBudget).toHaveBeenCalledWith(
          MAPPED_BUDGETS_DATA[0],
          MAPPED_MEETING_DATA.id
        );
        expect(store.getState().budgetPicker.budgets.length).toBe(
          MAPPED_BUDGETS_DATA.length
        );
        expect(store.getState().budgetPicker.error).toBe('Rejected');
      });
    });

    describe('bootstrap asyncThunk', () => {
      test('should return meeting', async () => {
        budgetsApi.fetchMeeting.mockResolvedValueOnce([
          [ORIGINAL_MEETING_DATA],
        ]);

        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(bootstrap(MAPPED_MEETING_DATA.id));

        expect(budgetsApi.fetchMeeting).toHaveBeenCalled();
        expect(budgetsApi.fetchMeeting).toHaveBeenCalledWith(
          MAPPED_MEETING_DATA.id
        );
        expect(store.getState().budgetPicker.meeting).toStrictEqual(
          MAPPED_MEETING_DATA
        );
      });

      test('should return specific error if meeting does not exist', async () => {
        budgetsApi.fetchMeeting.mockResolvedValueOnce([[{}]]);

        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(bootstrap('react_is_pain'));

        expect(budgetsApi.fetchMeeting).toHaveBeenCalled();
        expect(budgetsApi.fetchMeeting).toHaveBeenCalledWith('react_is_pain');
        expect(store.getState().budgetPicker.meeting).toStrictEqual({});
        expect(store.getState().budgetPicker.error).toBe('Rejected');
      });

      test('should return error if API returns error', async () => {
        budgetsApi.fetchMeeting.mockRejectedValueOnce(new Error('Test error'));

        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            budgetPicker: slice.reducer,
          },
        });

        await store.dispatch(bootstrap(MAPPED_MEETING_DATA.id));

        expect(budgetsApi.fetchMeeting).toHaveBeenCalled();
        expect(store.getState().budgetPicker.meeting).toStrictEqual({});
        expect(store.getState().budgetPicker.error).toBe('Rejected');
      });
    });
  });

  describe('reducers and extraReducers', () => {
    let state;

    beforeEach(() => {
      state = initialState;
    });

    test('setOffset reducer', () => {
      const nextState = budgetPickerReducer(
        state,
        setOffset(BUDGETS_LIMIT + 5)
      );

      expect(nextState.params.offset).toBe(BUDGETS_LIMIT + 5);
    });

    test('setBudgetSearchQuery reducer', () => {
      const newState = budgetPickerReducer(
        state,
        setBudgetSearchQuery('test 123')
      );

      expect(newState.params.searchQuery).toBe('test 123');
    });

    test('toggleSystemGeneratedFilter reducer', () => {
      const newState = budgetPickerReducer(
        state,
        toggleSystemGeneratedFilter()
      );

      expect(newState.isSystemGeneratedFilterEnabled).toBe(
        !state.isSystemGeneratedFilterEnabled
      );
    });

    test('hideLoader reducer', () => {
      const newState = budgetPickerReducer(state, hideLoader());

      expect(newState.loadingStatus).toBe(LOADING_STATUS.IDLE);
    });

    test('removeSelectedBudget reducer', () => {
      const newState = budgetPickerReducer(
        { ...state, budgets: [{ id: 1 }, { id: 2 }, { id: 3 }] },
        removeSelectedBudget({ id: 2 })
      );

      expect(newState.budgets.length).toBe(2);
    });

    test('fetchBudgets.pending extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        fetchBudgets.pending('', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });

    test('fetchBudgets.fulfilled extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        fetchBudgets.fulfilled([{ id: 1 }, { id: 2 }], '', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.budgets.length).toBe(2);
    });

    test('fetchBudgets.rejected extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        fetchBudgets.rejected(null, '', () => {}, 'Rejected', {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    test('fetchMoreBudgets.pending extraReducers', () => {
      const newState = budgetPickerReducer(
        { state, budgets: [{ id: 1 }, { id: 2 }] },
        fetchMoreBudgets.pending('', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FETCHING_MORE);
      expect(newState.error).toBeNull();
    });

    test('fetchMoreBudgets.fulfilled extraReducers', () => {
      const newState = budgetPickerReducer(
        {
          state,
          budgets: [{ id: 1 }, { id: 2 }],
        },
        fetchMoreBudgets.fulfilled([{ id: 3 }, { id: 4 }], '', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.budgets.length).toBe(4);
    });

    test('fetchMoreBudgets.rejected extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        fetchMoreBudgets.rejected(null, '', () => {}, 'Rejected', {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    test('saveBudget.pending extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        saveBudget.pending('', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUBMITTING);
      expect(newState.error).toBeNull();
    });

    test('saveBudget.rejected extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        saveBudget.rejected(null, '', () => {}, 'Rejected', {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    test('bootstrap.fulfilled extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        bootstrap.fulfilled({ id: 1, name: 'Test' }, '', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.IDLE);
      expect(newState.meeting).toStrictEqual({ id: 1, name: 'Test' });
    });

    test('bootstrap.rejected extraReducers', () => {
      const newState = budgetPickerReducer(
        state,
        bootstrap.rejected(null, '', () => {}, 'Rejected', {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });
  });
});
