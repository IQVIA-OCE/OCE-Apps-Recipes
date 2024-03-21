export const searchFieldSelector = (state) =>
    state.search.params.searchField;
export const searchQuerySelector = (state) =>
    state.search.params.searchQuery;
export const activeScreenSelector = (state) =>
    state.search.activeScreen;
export const sortClauseSelector = (state) =>
    state.search.sortClause;