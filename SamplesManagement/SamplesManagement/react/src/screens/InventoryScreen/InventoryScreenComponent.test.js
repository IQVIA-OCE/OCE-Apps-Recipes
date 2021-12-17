import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InventoryScreenComponent from './InventoryScreenComponent';
import { InventoryContext } from './InventoryContext';
import { useBanner, useBoolean } from '../../hooks';
import { AppContext } from '../../../AppContext';
import { Formik } from 'formik';
import { saveInventory } from '../../api/Inventories';
import { Button } from 'apollo-react-native';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';
import { INVENTORY_STATUS } from './constants';

jest.mock('../../api/Inventories');
jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native');
jest.mock('../../hooks');
jest.mock('moment', () => () => ({
  format: () => 'May 3, 2020 06:19 pm',
  toISOString: () => 'May 3, 2020',
}));

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
    const tree = renderer.create(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider value={inventoryContext}>
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    );

    act(() => {
      tree.root.findAllByType(Button)[0].props.onPress();
    });

    expect(navigation.goBack).toHaveBeenCalledTimes(1);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render preview', () => {
    const tree = renderer.create(
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

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render preview submitted', () => {
    const tree = renderer.create(
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

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render loader', () => {
    const tree = renderer.create(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{ ...inventoryContext, isLoading: true }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render error', () => {
    const tree = renderer.create(
      <AppContext.Provider value={context}>
        <InventoryContext.Provider
          value={{ ...inventoryContext, error: 'Error' }}
        >
          <InventoryScreenComponent navigation={navigation} />
        </InventoryContext.Provider>
      </AppContext.Provider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should trigger submit', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <InventoryContext.Provider value={inventoryContext}>
            <InventoryScreenComponent navigation={navigation} />
          </InventoryContext.Provider>
        </AppContext.Provider>
      );
    });
    await act(
      async () => await tree.root.findByType(Formik).props.onSubmit({}, {})
    );
    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);

    await act(
      async () =>
        await tree.root
          .findByType(Formik)
          .props.onSubmit(
            { buttonPressed: 'Submitted', products: [product] },
            { setFieldValue }
          )
    );
    act(() => {
      tree.root.findByType(Formik).props.validationSchema();
    });
    jest.advanceTimersByTime(1000);
    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('Should trigger submit saved inventory', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
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
      );
    });

    await act(
      async () => await tree.root.findByType(Formik).props.onSubmit({}, {})
    );
    jest.advanceTimersByTime(1000);
    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);

    await act(
      async () =>
        await tree.root
          .findByType(Formik)
          .props.onSubmit(
            { buttonPressed: 'Submitted', products: [product] },
            { setFieldValue }
          )
    );
    act(() => {
      tree.root.findByType(Formik).props.validationSchema();
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
    let tree;
    act(() => {
      tree = renderer.create(
        <AppContext.Provider value={context}>
          <InventoryContext.Provider value={inventoryContext}>
            <InventoryScreenComponent navigation={navigation} />
          </InventoryContext.Provider>
        </AppContext.Provider>
      );
    });

    await act(
      async () => await tree.root.findByType(Formik).props.onSubmit({}, {})
    );
    jest.runAllTimers();
    expect(navigation.navigate).toHaveBeenCalledTimes(0);
  });
});
