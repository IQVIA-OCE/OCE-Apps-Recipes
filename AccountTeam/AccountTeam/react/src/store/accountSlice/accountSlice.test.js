import { configureStore } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '../../constants';
import {
    teamMembers, territoryNameIds
} from '../../constants/mockData'
import { ACCESS_LEVEL_PICKLIST } from '../../constants'
import {
    bootstrap,
    initialState,
    accountReducer,
    makeSlice,
    setPositionofInfoContainer,
    setInfoContainerTopPosition,
    setSelectedRow,
    setInfoContainerVisible,
    setSearchQuery,
    setTerritoryIds,
    setOffset,
    fetchAccountTeams,
    fetchMoreAccountTeams,
    setiPhoneContainerWidth,
    setMaximumHeight,
    setAppContainerHeight,
    setListRowHeight,
    setActiveIndex
} from './accountSlice';

import * as accountTeamsApi from '../../api/accountTeamsApi';

jest.mock('../../api/accountTeamsApi', () => ({
    fetchTerritoryIdForAccounts: jest.fn(),
    fetchTerritoryIds: jest.fn(),
    fetchTerritoryIdFromName: jest.fn(),
    fetchAccountTeamMemebers: jest.fn(),
}));

describe('accountSlice', () => {
    describe('async thunks', () => {
        beforeEach(() => {
            accountTeamsApi.fetchTerritoryIdForAccounts.mockReset();
            accountTeamsApi.fetchTerritoryIds.mockReset();
            accountTeamsApi.fetchTerritoryIdFromName.mockReset();
            accountTeamsApi.fetchAccountTeamMemebers.mockReset();
        });

        describe('bootstrap', () => {
            it('bootstrap should return first set of account team members', async () => {
                accountTeamsApi.fetchTerritoryIdForAccounts.mockResolvedValueOnce(teamMembers);

                const slice = makeSlice(initialState);
                const store = configureStore({
                    reducer: {
                        account: slice.reducer,
                    },
                });
                await store.dispatch(bootstrap('0014x000009EWxNAAW'));
                expect(accountTeamsApi.fetchTerritoryIdForAccounts).toHaveBeenCalled();
            });
            it('bootstrap should return empty set of account team members with empty account id', async () => {
                accountTeamsApi.fetchTerritoryIdForAccounts.mockResolvedValueOnce(null);

                const slice = makeSlice(initialState);
                const store = configureStore({
                    reducer: {
                        account: slice.reducer,
                    },
                });
                await store.dispatch(bootstrap());
                expect(accountTeamsApi.fetchTerritoryIdForAccounts).toHaveBeenCalled();
            });
            it('bootstrap should return first set of account team members from account names', async () => {
                accountTeamsApi.fetchTerritoryIdForAccounts.mockResolvedValueOnce(territoryNameIds);

                const slice = makeSlice(initialState);
                const store = configureStore({
                    reducer: {
                        account: slice.reducer,
                    },
                });
                await store.dispatch(bootstrap('0014x000009EWxNAAW'));
                expect(accountTeamsApi.fetchTerritoryIdForAccounts).toHaveBeenCalled();
            });
            it('bootstrap should  return empty array for invalid account Id', async () => {
                accountTeamsApi.fetchTerritoryIdForAccounts.mockResolvedValueOnce([]);

                const slice = makeSlice(initialState);
                const store = configureStore({
                    reducer: {
                        account: slice.reducer,
                    },
                });
                await store.dispatch(bootstrap('0014x000009EWxNAAX'));
                expect(accountTeamsApi.fetchTerritoryIdForAccounts).toHaveBeenCalled();
            });

        });

    });

    describe('reducers and extra reducers', () => {
        let state;
        beforeEach(() => {
            state = initialState;
        });

        it('setActiveIndex reducer', () => {
            const newState = accountReducer(
                state,
                setPositionofInfoContainer({ x: 100, y: 200, width: 200, height: 400 })
            );
            expect(newState.position).toStrictEqual({ x: 100, y: 200, width: 200, height: 400 });
            expect(newState.infoContainerTopPosition).toBe(0);
        });

        it('setSelectedRow reducer', () => {
            const newState = accountReducer(
                state,
                setSelectedRow(teamMembers[0])
            );
            expect(newState.selectedData).toStrictEqual(teamMembers[0]);
        });

        it('setInfoContainerVisible reducer', () => {
            const newState = accountReducer(
                state,
                setInfoContainerVisible(true)
            );
            expect(newState.shouldShowDetailScreen).toStrictEqual(true);
        });
        it('setInfoContainerVisible reducer with false', () => {
            const newState = accountReducer(
                state,
                setInfoContainerVisible(false)
            );
            expect(newState.shouldShowDetailScreen).toStrictEqual(false);
        });

        it('setInfoContainerTopPosition reducer', () => {
            const newState = accountReducer(
                state,
                setInfoContainerTopPosition(0)
            );
            expect(newState.infoContainerTopPosition).toStrictEqual(0);
        });

        it('setSearchQuery reducer', () => {
            const newState = accountReducer(
                state,
                setSearchQuery('Admin')
            );
            expect(newState.params.searchQuery).toStrictEqual('Admin');
        });

        it('setSearchQuery reducer', () => {
            const newState = accountReducer(
                state,
                setTerritoryIds("'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'")
            );
            expect(newState.params.territoryIds).toStrictEqual("'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'");
        });

        it('setOffset reducer', () => {
            const newState = accountReducer(
                state,
                setOffset(5)
            );
            expect(newState.params.offset).toStrictEqual(5);
        });
        it('setiPhoneContainerWidth reducer', () => {
            const newState = accountReducer(
                state,
                setiPhoneContainerWidth(300)
            );
            expect(newState.iPhoneContainerWidth).toStrictEqual(300);
        });
        it('setMaximumHeight reducer', () => {
            const newState = accountReducer(
                state,
                setMaximumHeight(221)
            );
            expect(newState.maxHeight).toStrictEqual(221);
        });
        it('setAppContainerHeight reducer', () => {
            const newState = accountReducer(
                state,
                setAppContainerHeight(600)
            );
            expect(newState.appContainerHeight).toStrictEqual(600);
        });
        it('setListRowHeight reducer', () => {
            const newState = accountReducer(
                state,
                setListRowHeight(130)
            );
            expect(newState.rowHeight).toStrictEqual(130);
        });
        it('setActiveIndex reducer', () => {
            const newState = accountReducer(
                state,
                setActiveIndex(0)
            );
            expect(newState.activeIndex).toStrictEqual(0);
        });
        it('bootstrap.fulfilled', () => {
            const nextState = accountReducer(
                state,
                bootstrap.fulfilled({ records: teamMembers, accessLevels: ACCESS_LEVEL_PICKLIST })
            );

            expect(nextState.loadingStatus).toBe(LOADING_STATUS.IDLE);
            expect(nextState.accountTeams).toStrictEqual(teamMembers);
            expect(nextState.accessLevelOptions).toStrictEqual(ACCESS_LEVEL_PICKLIST);
        });

        it('bootstrap.rejected extraReducers', () => {
            const newState = accountReducer(
                state,
                bootstrap.rejected(null, '', () => { }, 'Rejected', {})
            );

            expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
            expect(newState.error).toBe('Rejected');
        });

        it('fetchAccountTeams.fulfilled', () => {
            const nextState = accountReducer(
                state,
                fetchAccountTeams.fulfilled(teamMembers)
            );

            expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
            expect(nextState.accountTeams).toStrictEqual(teamMembers);
        });

        it('fetchAccountTeams.rejected', () => {
            const nextState = accountReducer(
                state,
                fetchAccountTeams.rejected('error')
            );

            expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
            expect(nextState.error).toBe('error');
        });

        it('fetchMoreAccountTeams.pending', () => {
            const nextState = accountReducer(
                state,
                fetchMoreAccountTeams.pending()
            );

            expect(nextState.loadingStatus).toBe(LOADING_STATUS.PENDING);
            expect(nextState.error).toBe(null);
        });

        it('fetchMoreAccountTeams.fullfilled', () => {
            const nextState = accountReducer(
                state,
                fetchMoreAccountTeams.fulfilled(teamMembers, '', () => { }, {})
            );

            expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
            expect(nextState.accountTeams).toStrictEqual(teamMembers);
        });
        it('fetchMoreAccountTeams.rejected', () => {
            const nextState = accountReducer(
                state,
                fetchMoreAccountTeams.rejected('error')
            );

            expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
            expect(nextState.error).toBe('error');
        });

    });
});
