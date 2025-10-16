import {
    initialState,
    setSortOption,
    setSortOrder,
    sortListReducer,
    setApplyFilter,
    clearFilter,
    setSortListVisibile,
    setIsFilterApplied
} from './sortListSlice';

describe('sortListSlice', () => {
    describe('reducers', () => {
        let state;
        beforeEach(() => {
            state = initialState;
        });
        it('setSortOption reducer', () => {
            const nextState = sortListReducer(
                state,
                setSortOption({
                    Id: 1,
                    value: 'userName',
                    label: 'User Name'
                })
            );
            expect(nextState.sortOption).toStrictEqual({
                Id: 1,
                value: 'userName',
                label: 'User Name'
            });
        });
        it('setSortOrder reducer', () => {
            const nextState = sortListReducer(
                state,
                setSortOrder(false)
            );
            expect(nextState.sortAscOrder).toBe(false);
        });
        it('setApplyFilter reducer with empty values', () => {
            const nextState = sortListReducer(
                state,
                setApplyFilter({})
            );
            expect(nextState.isFilterApplied).toBe(true);
            expect(nextState.filterValue).toStrictEqual({});
            expect(nextState.filterCount).toBe(0);
        })
        it('setApplyFilter reducer with non-empty values', () => {
            const nextState = sortListReducer(
                state,
                setApplyFilter({ 'User.Name': 'Admin' })
            );
            expect(nextState.isFilterApplied).toBe(true);
            expect(nextState.filterValue).toStrictEqual({ 'User.Name': 'Admin' });
            expect(nextState.filterCount).toBe(1);
        })

        it('clearFilter reducer', () => {
            const nextState = sortListReducer(
                state,
                clearFilter()
            );
            expect(nextState.isFilterApplied).toBe(false);
            expect(nextState.filterValue).toBe(null);
            expect(nextState.filterCount).toBe(0);
        })

        it('setSortListVisibile reducer', () => {
            const nextState = sortListReducer(
                state,
                setSortListVisibile(true)
            );
            expect(nextState.shouldShowSortList).toBe(true);
        })
        it('setIsFilterApplied reducer', () => {
            const nextState = sortListReducer(
                state,
                setIsFilterApplied(true)
            );
            expect(nextState.isFilterApplied).toBe(false);
        })
    });
});

