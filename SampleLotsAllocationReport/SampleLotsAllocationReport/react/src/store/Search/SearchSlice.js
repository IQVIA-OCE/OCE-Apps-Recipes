import { createSlice } from '@reduxjs/toolkit';

export const REPORT_LIMIT = 25;

export const initialState = {
  params: {
    limit: REPORT_LIMIT,
    offset: 0,
    searchQuery: '',
    searchField: ''
  },
  activeScreen: 'sla',
  sortClause: '',
  prevSearchQuery: '',
  prevSearchField: ''
};

export const makeSearchSlice = (_initialState) =>
  createSlice({
    name: 'search',
    initialState: _initialState,
    reducers: {
      setOffset: (state, action) => {
        state.params.offset = action.payload;
      },
      setSearchQuery: (state, action) => {
        state.params.searchQuery = action.payload;
      },
      setSearchField: (state, action) => {
        state.params.searchField = action.payload;
        state.params.offset = 0;
      },
      setActiveScreen: (state, action) => {
        state.activeScreen = action.payload;
        state.prevSearchQuery = state.params.searchQuery;
        state.prevSearchField = state.params.searchField;
        state.params.offset = 0;
        state.params.searchField = null;
        state.params.searchQuery = '';
      },
      setSortClause: (state, action) => {
        state.sortClause = action.payload
      },
      resetSearchFilters: (state, action) => {
        state.activeScreen = action.payload;
        state.sortClause = null;
        state.params.searchField = state.prevSearchField;
        state.params.searchQuery = state.prevSearchQuery;
      }
    },
  });

export const searchSlice = makeSearchSlice(initialState);

export const {
  setOffset,
  setSearchQuery,
  setSearchField,
  setActiveScreen,
  setSortClause,
  resetSearchFilters
} = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
