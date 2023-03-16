import {
  REPORT_LIMIT,
  setOffset, setSearchQuery, setSearchField, searchReducer, setActiveScreen, setSortClause, resetSearchFilters
} from "./SearchSlice";

jest.mock('../../api/reportApi', () => ({
  fetchReportData: jest.fn(),
}));

jest.mock('oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    sfApiVersion: () => '',
    userID: () => '',
    locale: () => '',
    territory: () => '',
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));

const testInitialState = {
  params: {
    limit: REPORT_LIMIT,
    offset: 0,
    searchQuery: '',
    searchField: ''
  },
  activeScreen: 'sla',
  sortClause: '',
  prevSearchQuery: 'Alodox',
  prevSearchField: 'product'
};

describe('SearchSlice.js', () => {

  describe('reducers and extra reducers', () => {
    let state;
    beforeEach(() => {
      state = testInitialState;
    });

    it('setOffset reducer', () => {
      const newState = searchReducer(state, setOffset(5));
      expect(newState.params.offset).toStrictEqual(5);
    });
    it('setSearchQuery reducer', () => {
      const newState = searchReducer(state, setSearchQuery('ASHOK'));
      expect(newState.params.searchQuery).toStrictEqual('ASHOK');
    });
    it('setSearchField reducer', () => {
      const newState = searchReducer(state, setSearchField('product'));
      expect(newState.params.searchField).toStrictEqual('product');
    });
    it('setActiveScreen reducer', () => {
      const newState = searchReducer(state, setActiveScreen('sla'));
      expect(newState.activeScreen).toStrictEqual('sla');
    });
    it('setSortClause reducer', () => {
      const newState = searchReducer(state, setSortClause('Product__r.Name ASC'));
      expect(newState.sortClause).toStrictEqual('Product__r.Name ASC');
    });
    it('resetSearchFilters reducer', () => {
      const newState = searchReducer(state, resetSearchFilters());
      expect(newState.params.searchQuery).toStrictEqual('Alodox');
      expect(newState.params.searchField).toStrictEqual('product');
    });
  });
});