import reducer, {
  setOrderDeliveries,
  setRecordId,
  setLoading,
  setSearchProductValue,
  setBrandFilterValue,
  setBrandOptions,
} from './orders';

const initialState = {
  orders: [],
  loading: false,
  error: false,
  _recordId: null,
  searchProductValue: "",
  brandOptions: [],
  brandFilter: null
};

jest.mock('oce-apps-bridges');
jest.mock('../api/OrderDetails');

test('should return the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState);
});

test('should handle order deliveries being added to an empty list', () => {
  const previousState = initialState;
  expect(
    reducer(
      previousState,
      setOrderDeliveries([{ productName: 'Test product name' }])
    )
  ).toEqual({
    ...initialState,
    orders: [{ productName: 'Test product name' }]
  });
});

test('should handle order deliveries added to an existing list', () => {
  const previousState = {
    orders: [{ productName: 'Test product name' }],
    loading: false,
    error: false,
    _recordId: null,
    searchProductValue: "",
    brandOptions: [],
    brandFilter: null
  };
  expect(
    reducer(
      previousState,
      setOrderDeliveries([{ productName: 'New product name' }])
    )
  ).toEqual({
    ...initialState,
    orders: [{ productName: 'New product name' }],
  });
});

test('should handle loading change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setLoading(true))).toEqual({
    ...initialState,
    loading: true,
  });
});

test('should handle record id change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setRecordId('111'))).toEqual({
    ...initialState,
    _recordId: '111',
  });
});

test('should handle searchProductValue change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setSearchProductValue('Product'))).toEqual({
    ...initialState,
    searchProductValue: 'Product',
  });
});

test('should handle brandFilter change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setBrandFilterValue('Brand'))).toEqual({
    ...initialState,
    brandFilter: 'Brand'
  });
});

test('should handle brandOptions change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setBrandOptions([1,2]))).toEqual({
    ...initialState,
    brandOptions: [1,2],
  });
});