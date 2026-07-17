import { createSlice } from '@reduxjs/toolkit'
import { SORT_OPTION_LIST } from '../../constants'

export const initialState = {
    sortOption: null,
    sortAscOrder: true,
    sortListData: SORT_OPTION_LIST,
    filterValue: null,
    isFilterApplied: false,
    shouldShowSortList: false,
    filterCount: 0
}
export const makeSlice = _initialState => createSlice({
    name: 'sortList',
    initialState: _initialState,
    reducers: {
        setSortOption: (state, action) => {
            state.sortOption = action.payload
        },
        setSortOrder: (state, action) => {
            state.sortAscOrder = action.payload
        },
        setApplyFilter: (state, action) => {
            const nonEmptyFilters = Object.values(action.payload).filter((val) => val.trim().length !== 0);
            state.isFilterApplied = true;
            state.filterValue = action.payload
            state.filterCount = nonEmptyFilters.length;
        },
        clearFilter: (state, action) => {
            state.isFilterApplied = false;
            state.filterValue = null;
            state.filterCount = 0;
        },
        setSortListVisibile: (state, action) => {
            state.shouldShowSortList = action.payload;
        },
        setIsFilterApplied: (state, action) => {
            state.isFilterApplied = false;
        }
    },
})

export const sortList = makeSlice(initialState);

export const { setSortOption, setSortOrder, clearFilter, setApplyFilter, setSortListVisibile, setIsFilterApplied } = sortList.actions

export const sortListReducer = sortList.reducer;
