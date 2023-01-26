import React from 'react';
import InventoryScreenComponent from './InventoryScreenComponent';
import { InventoryContext } from './InventoryContext';
import { useBanner, useBoolean } from '../../hooks';
import { AppContext } from '../../../AppContext';
import { Formik } from 'formik';
import { saveInventory } from '../../api/Inventories';
import { Button } from 'apollo-react-native';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';
import { INVENTORY_STATUS } from './constants';
import { render, act, waitFor } from '@testing-library/react-native';
import { Loader } from 'apollo-react-native';

jest.mock('../../api/Inventories');
jest.mock('../../hooks');
jest.mock('moment', () => () => ({
  format: () => 'May 3, 2020 06:19 pm',
  toISOString: () => 'May 3, 2020',
}));
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

let navigation;

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
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    navigation = {
      getParam: () => ({
        DeveloperName: 'AdHocInventory',
      }),
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    useBanner.mockReturnValue([
      { variant: '', message: '', visible: false, icon: '' },
      jest.fn(),
    ]);
    useBoolean.mockReturnValue([
      true,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);

    saveInventory.mockReturnValue([
      {
        sampleInventory: { Id: 1 },
        sampleInventoryDetails: [{ sampleProductId: 1 }],
      },
    ]);
  });

  it('should render properly', () => {
    const { getByText, container } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider value={inventoryContext}>
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    );

    act(() => {
      container.findAllByType(Button)[0].props.onPress();
    });

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
      </AppContext.Provider>
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
      </AppContext.Provider>
    );

    expect(getByText(/Last Reconciliation Date/)).toBeTruthy();
  });

  it('should render loader', async () => {
    const { getByTestId } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{ ...inventoryContext, isLoading: true }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    );

    expect(getByTestId('Loader')).toBeTruthy()
  });

  it('should render error', () => {
    const { getByText } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{ ...inventoryContext, error: 'Error' }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    );

    expect(getByText(/Error/)).toBeTruthy();
  });

  it('Should trigger submit', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider value={inventoryContext}>
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    )

    await act(
      async () => await container.findByType(Formik).props.onSubmit({}, {})
    );

    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);

    await act(
      async () =>
        await container
          .findByType(Formik)
          .props.onSubmit(
            { buttonPressed: 'Submitted', products: [product] },
            { setFieldValue }
          )
    );
    act(() => {
      container.findByType(Formik).props.validationSchema();
    });
    jest.advanceTimersByTime(1000);
    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('Should trigger submit saved inventory', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{
            ...inventoryContext,
            editingType: INVENTORY_FORM_TYPE.edit,
          }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    )

    await act(
      async () => await container.findByType(Formik).props.onSubmit({}, {})
    );

    jest.advanceTimersByTime(1000);
    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);

    await act(
      async () =>
        await container
          .findByType(Formik)
          .props.onSubmit(
            { buttonPressed: 'Submitted', products: [product] },
            { setFieldValue }
          )
    );
    act(() => {
      container.findByType(Formik).props.validationSchema();
    });

    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });
});

describe('Should submit error', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    navigation = {
      getParam: () => ({
        DeveloperName: 'AdHocInventory',
      }),
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    useBanner.mockReturnValue([
      { variant: '', message: '', visible: false, icon: '' },
      jest.fn(),
    ]);
    useBoolean.mockReturnValue([
      true,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);

    saveInventory.mockImplementation(() => {
      throw new Error();
    });
  });

  it('Should trigger submit error', async () => {
    const { container } = render(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider value={inventoryContext}>
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    )

    await act(
      async () => await container.findByType(Formik).props.onSubmit({}, {})
    );

    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(0);
  });
});
