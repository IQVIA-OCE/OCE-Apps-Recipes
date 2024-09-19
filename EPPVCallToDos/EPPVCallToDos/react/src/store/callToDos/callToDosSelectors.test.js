import { initialState } from './callToDosSlice';
import {
  callSelector,
  complianceTypesSelector,
  formLoadingStatusSelector,
  todosListItemsSelector,
  todosListLoadingStatusSelector,
  todosListParamsSelector,
  todosListTotalCountSelector,
} from './callToDosSelectors';
import { LOADING_STATUS } from '../../constants';

describe('callToDosSelectors', () => {
  const state = { callToDos: initialState };

  it('formLoadingStatusSelector', () => {
    expect(formLoadingStatusSelector(state)).toBe(LOADING_STATUS.IDLE);
  });

  it('callSelector', () => {
    expect(callSelector(state)).toStrictEqual({});
  });

  it('complianceTypesSelector', () => {
    expect(complianceTypesSelector(state)).toStrictEqual([]);
  });

  it('todosListLoadingStatusSelector', () => {
    expect(todosListLoadingStatusSelector(state)).toBe(LOADING_STATUS.IDLE);
  });

  it('todosListParamsSelector', () => {
    expect(todosListParamsSelector(state)).toStrictEqual({
      callId: null,
      page: 1,
      rowsPerPage: 5,
      sortColumn: null,
      sortOrder: null,
    });
  });

  it('todosListTotalCountSelector', () => {
    expect(todosListTotalCountSelector(state)).toBe(0);
  });

  it('todosListItemsSelector', () => {
    expect(todosListItemsSelector(state)).toStrictEqual([]);
  });
});
