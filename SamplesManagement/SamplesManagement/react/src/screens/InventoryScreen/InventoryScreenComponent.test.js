import React from 'react';
import InventoryScreenComponent from './InventoryScreenComponent';
import { InventoryContext } from './InventoryContext';
import { useBanner, useBoolean } from '../../hooks';
import { AppContext } from '../../AppContext';
import { Formik } from 'formik';
import { saveInventory } from '../../api/Inventories';
import { Button } from '@oce-apps/apollo-react-native';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';
import { INVENTORY_STATUS } from './constants';
import { render, act, fireEvent } from '@testing-library/react-native';

jest.mock('moment', () => () => ({
  format: () => 'May 3, 2020 06:19 pm',
  toISOString: () => 'May 3, 2020',
}));
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});
jest.mock('../../hooks/useBanner');
jest.mock('../../hooks/useBoolean');
useBanner.mockReturnValue([
  { variant: '', message: '', visible: false, icon: '' },
  jest.fn(),
]);
useBoolean.mockReturnValue([
  true,
  { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
]);

let navigation = {
  getParam: () => ({
    DeveloperName: 'AdHocInventory',
  }),
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const context = {
  username: 'test user name',
  userId: '1',
};

const product = {
  deleted: false,
  detailLabel: '6586-4',
  discrepancyReason: '',
  hasQuantityError: false,
  label: 'ADRAVIL TAB 20 MG Physical',
  locked: true,
  lotNumber: '6586-4',
  lotNumberId: 'b3P0T00000007rwUAb',
  openingBalance: 0,
  physicalQuantity: '',
  quantityIn: 5,
  quantityOut: 5,
  sampleProductId: 1,
  systemCount: 0,
};

const inventoryContext = {
  editingType: INVENTORY_FORM_TYPE.edit,
  products: [product],
  isLoading: false,
  preselectedProducts: [product],
  productsHistory: [],
  lastInventoryCreatedDate: 'May 3, 2020 06:19 pm',
  error: null,
  transactionDetails: [{ id: 1 }],
  config: { showCalculatedFields: true },
  formInitialValues: {
    products: [product],
  },
  recordType: {
    DeveloperName: 'AdHocInventory',
  },
};

const setFieldValue = jest.fn();

describe('InventoryScreenComponent', () => {
  beforeEach(() => {
    navigation.navigate.mockClear();
    navigation.goBack.mockClear();
  });

  it('should render properly', () => {
    const { getByText, UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider value={inventoryContext}>
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);

    expect(getByText(/Last Reconciliation Date/)).toBeTruthy();
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('should render preview', () => {
    const { getByText } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{
            ...inventoryContext,
            config: { historyHidden: true },
            editingType: INVENTORY_FORM_TYPE.preview,
          }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );

    expect(getByText(/Back/)).toBeTruthy();
  });

  it('should render preview submitted', () => {
    const { getByText } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{
            ...inventoryContext,
            editingType: INVENTORY_FORM_TYPE.preview,
            config: { historyHidden: true },
            formInitialValues: {
              ...inventoryContext.formInitialValues,
              status: INVENTORY_STATUS.submitted,
            },
          }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );

    expect(getByText(/Last Reconciliation Date/)).toBeTruthy();
  });

  it('should render loader', () => {
    const { getByTestId } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{ ...inventoryContext, isLoading: true }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );
    act(() => jest.runAllTimers());

    expect(getByTestId('Loader')).toBeTruthy();
  });

  it('should render error', () => {
    const { getByText } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{ ...inventoryContext, error: 'Error' }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );

    expect(getByText(/Error/)).toBeTruthy();
  });

  it('Should trigger submit', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider value={inventoryContext}>
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {}, {});
    act(() => jest.runAllTimers());

    expect(navigation.navigate).toHaveBeenCalledTimes(1);

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      buttonPressed: 'Submitted',
      products: [product],
    }, { setFieldValue });
    fireEvent(UNSAFE_root.findByType(Formik), 'validationSchema');
    act(() => jest.runAllTimers());

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('Should trigger submit saved inventory', () => {
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{
            ...inventoryContext,
            editingType: INVENTORY_FORM_TYPE.edit,
          }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {}, {});
    act(() => jest.runAllTimers());

    expect(navigation.navigate).toHaveBeenCalledTimes(1);

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {
      buttonPressed: 'Submitted',
      products: [product],
    }, { setFieldValue });
    fireEvent(UNSAFE_root.findByType(Formik), 'validationSchema');
    act(() => jest.runAllTimers());

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('Should trigger submit error', () => {
    saveInventory.mockRejectedValueOnce(new Error());
    const { UNSAFE_root } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider value={inventoryContext}>
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>,
    );

    fireEvent(UNSAFE_root.findByType(Formik), 'onSubmit', {}, {});
    act(() => jest.runAllTimers());

    expect(navigation.navigate).toHaveBeenCalledTimes(0);
  });
});
