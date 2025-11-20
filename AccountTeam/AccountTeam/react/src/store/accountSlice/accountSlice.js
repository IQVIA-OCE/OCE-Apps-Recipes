import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as accountTeamsApi from '../../api/accountTeamsApi'
import { splitStringFromArray, mapAccessLevels } from '../../utils/helper'
import { LOADING_STATUS } from '../../constants';
import { setIsFilterApplied } from '../sortSlice/sortListSlice'

const RECORD_LIMIT = 15;

export const initialState = {
    accountTeams: [],
    accessLevelOptions: [],
    accountId: null,
    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
    params: {
        limit: 15,
        offset: 0,
        searchQuery: '',
        territoryIds: ''
    },
    position: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },
    infoContainerTopPosition: 0,
    error: null,
    selectedData: null,
    shouldShowDetailScreen: false,
    iPhoneContainerWidth: 0,
    maxHeight: 'auto',
    appContainerHeight: 0,
    rowHeight: 0,
    activeIndex: -1
}
export const bootstrap = createAsyncThunk(
    'accountTeams/bootstrap',
    async (selectedAccount = null, { getState, dispatch, rejectWithValue }) => {
        let {
            account: { params, accountId },
        } = getState();
        if (!accountId) {
            dispatch(setAccountId(selectedAccount));
            accountId = selectedAccount;
        }
        try {
            const territoryIdsForAccount = await accountTeamsApi.fetchTerritoryIdForAccounts(accountId);
            if (!territoryIdsForAccount) {
                return [];
            }
            let territoryIds = splitStringFromArray(territoryIdsForAccount, 'Territory2Id');
            if (territoryIdsForAccount[0]?.Id) {
                territoryIds = splitStringFromArray(territoryIdsForAccount, 'Id');
            }
            dispatch(setTerritoryIds(territoryIds));
            const [
                accessLevels,
                records,
            ] = await Promise.all([
                accountTeamsApi.fetchLayouts('Territory2'),
                accountTeamsApi.fetchAccountTeamMemebers({ ...params, territoryIds })
            ]);
            dispatch(setIsFilterApplied());
            return {
                accessLevels: mapAccessLevels(accessLevels),
                records
            };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const fetchAccountTeams = createAsyncThunk(
    'accountTeams/fetchAccountTeams',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const {
            account: { params },
            sortList: { sortOption, sortAscOrder, filterValue }
        } = getState();
        let order = 'ASC';
        if (!sortAscOrder) {
            order = 'DESC';
        }
        let sortBy = 'User.LastName';
        if (sortOption) {
            sortBy = sortOption.value;
        }
        try {
            const records = await accountTeamsApi.fetchAccountTeamMemebers({ ...params, offset: 0, sortBy: sortBy, filter: filterValue, order });
            dispatch(setOffset(0));
            dispatch(setIsFilterApplied());
            return records;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchMoreAccountTeams = createAsyncThunk(
    'accountTeams/fetchMoreAccountTeams',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const {
            account: { params },
            sortList: { sortOption, sortAscOrder, filterValue }
        } = getState();
        let order = 'ASC';
        if (!sortAscOrder) {
            order = 'DESC';
        }

        let sortBy = 'User.LastName';
        if (sortOption) {
            sortBy = sortOption.value;
        }

        try {
            const records = await accountTeamsApi.fetchAccountTeamMemebers({ ...params, offset: params.offset + RECORD_LIMIT, sortBy, filter: filterValue, order });
            dispatch(setOffset(params.offset + RECORD_LIMIT));
            return records;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const makeSlice = _initialState => createSlice({
    name: 'account',
    initialState: _initialState,
    reducers: {
        setPositionofInfoContainer: (state, action) => {
            state.position = action.payload;
            state.infoContainerTopPosition = 0;
        },
        setSelectedRow: (state, action) => {
            state.selectedData = action.payload;
        },
        setInfoContainerVisible: (state, action) => {
            state.shouldShowDetailScreen = action.payload
            if (!action.payload) {
                state.maxHeight = 'auto';
                state.activeIndex = -1;
            }
        },
        setInfoContainerTopPosition: (state, action) => {
            state.infoContainerTopPosition = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.params.searchQuery = action.payload
        },
        setAccountId: (state, action) => {
            state.accountId = action.payload;
        },
        setTerritoryIds: (state, action) => {
            state.params.territoryIds = action.payload;
        },
        setOffset: (state, action) => {
            state.params.offset = action.payload;
        },
        setiPhoneContainerWidth: (state, action) => {
            state.iPhoneContainerWidth = action.payload;
        },
        setMaximumHeight: (state, action) => {
            state.maxHeight = action.payload;
        },
        setAppContainerHeight: (state, action) => {
            state.appContainerHeight = action.payload
        },
        setListRowHeight: (state, action) => {
            state.rowHeight = action.payload
        },
        setActiveIndex: (state, action) => {
            state.activeIndex = action.payload
        },
    },

    extraReducers: {
        [bootstrap.fulfilled]: (state, action) => {
            state.loadingStatus = LOADING_STATUS.IDLE;
            state.accountTeams = action.payload.records;
            state.accessLevelOptions = action.payload.accessLevels
        },
        [bootstrap.rejected]: (state, action) => {
            state.loadingStatus = LOADING_STATUS.FAILED;
            state.error = action.error.message;
        },
        [fetchAccountTeams.pending]: state => {
            state.loadingStatus = LOADING_STATUS.PENDING;
            state.error = null;
        },
        [fetchAccountTeams.fulfilled]: (state, action) => {
            state.loadingStatus = LOADING_STATUS.SUCCESS;
            state.accountTeams = action.payload;
        },
        [fetchAccountTeams.rejected]: (state, action) => {
            state.loadingStatus = LOADING_STATUS.FAILED;
            state.error = action.error.message;
        },
        [fetchMoreAccountTeams.pending]: state => {
            state.loadingStatus = LOADING_STATUS.PENDING;
            state.error = null;
        },
        [fetchMoreAccountTeams.fulfilled]: (state, action) => {
            state.loadingStatus = LOADING_STATUS.SUCCESS;
            state.accountTeams = [...state.accountTeams, ...action.payload];
        },
        [fetchMoreAccountTeams.rejected]: (state, action) => {
            state.loadingStatus = LOADING_STATUS.FAILED;
            state.error = action.error.message;
        }
    },
})

export const account = makeSlice(initialState);


export const {
    setPositionofInfoContainer,
    setSelectedRow,
    setInfoContainerVisible,
    setInfoContainerTopPosition,
    setSearchQuery,
    setAccountId,
    setTerritoryIds,
    setOffset,
    setiPhoneContainerWidth,
    setMaximumHeight,
    setAppContainerHeight,
    setListRowHeight,
    setActiveIndex
} = account.actions

export const accountReducer = account.reducer;
