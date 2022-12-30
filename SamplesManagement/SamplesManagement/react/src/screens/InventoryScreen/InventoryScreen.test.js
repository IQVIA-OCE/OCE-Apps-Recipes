import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InventoryScreen from './InventoryScreen';
import { Formik } from 'formik';
import { InventoryContext } from './InventoryContext';
import ProductListItem from '../../components/ProductsList/ProductListItem';
import ActionCell from './InventoryTable/ActionCell';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';
import { Tabs } from 'apollo-react-native';
import InventoryTable from './InventoryTable/InventoryTable';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

const push = jest.fn();
const remove = jest.fn();
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
  sampleProductId: 'a4h0T0000004XVtQAM',
  systemCount: 0,
};

let setFieldValue;
const initialValues = { products: [product] };
describe('InventoryScreen', () => {
  beforeEach(() => {
    setFieldValue = jest.fn();
  });
  it('should render properly', () => {
    const tree = renderer.create(
      <InventoryContext.Provider
        value={{
          products: [product],
          config: {},
          editingType: INVENTORY_FORM_TYPE.edit,
        }}
      >
        <Formik
          initialValues={{
            ...initialValues,
            deletedProducts: [{ ...product, id: 2 }],
          }}
        >
          <InventoryScreen
            push={push}
            remove={remove}
            form={{
              values: {
                ...initialValues,
                deletedProducts: [{ ...product, id: 2 }],
              },
              setFieldValue,
            }}
          />
        </Formik>
      </InventoryContext.Provider>
    );

    tree.root.findByType(ProductListItem).props.onPress(product);
    tree.root.findByType(ActionCell).props.onPress({ id: 1 }, 1);
    act(() => {
      tree.root.findByType(Tabs).props.onSelect(1);
    });

    expect(push).toBeCalled();
    expect(remove).toBeCalled();
    expect(setFieldValue).toBeCalled();

    expect(tree.toJSON()).toMatchSnapshot();

    act(() => {
      tree.root.findByType(InventoryTable).props.showProductHistory();
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should delete properly', () => {
    const tree = renderer.create(
      <InventoryContext.Provider
        value={{
          products: [product],
          config: {},
          editingType: INVENTORY_FORM_TYPE.edit,
        }}
      >
        <Formik initialValues={{ ...initialValues, deletedProducts: null }}>
          <InventoryScreen
            push={push}
            remove={remove}
            form={{ values: initialValues, setFieldValue }}
          />
        </Formik>
      </InventoryContext.Provider>
    );

    tree.root.findByType(ProductListItem).props.onPress(product);
    tree.root.findByType(ActionCell).props.onPress({ id: 1 }, 1);
    act(() => {
      tree.root.findByType(Tabs).props.onSelect(1);
    });

    expect(push).toBeCalled();
    expect(remove).toBeCalled();
    expect(setFieldValue).toBeCalled();

    expect(tree.toJSON()).toMatchSnapshot();

    act(() => {
      tree.root.findByType(InventoryTable).props.showProductHistory();
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
