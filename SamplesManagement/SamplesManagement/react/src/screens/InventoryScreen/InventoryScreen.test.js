import React from 'react';
import InventoryScreen from './InventoryScreen';
import { Formik } from 'formik';
import { InventoryContext } from './InventoryContext';
import ProductListItem from '../../components/ProductsList/ProductListItem';
import ActionCell from './InventoryTable/ActionCell';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';
import { Tabs } from '@oce-apps/apollo-react-native';
import InventoryTable from './InventoryTable/InventoryTable';
import { render, fireEvent } from '@testing-library/react-native';
import HistoryTimeline from './HistoryTimeline/HistoryTimeline';

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

let setFieldValue = jest.fn();
const initialValues = { products: [product] };

describe('InventoryScreen', () => {
  beforeEach(() => {
    setFieldValue.mockClear();
  });

  it('should render properly', () => {
    const { findAllByText, UNSAFE_root } = render(
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

    fireEvent.press(UNSAFE_root.findByType(ProductListItem), product);
    fireEvent.press(UNSAFE_root.findByType(ActionCell), { id: 1 }, 1);
    fireEvent(UNSAFE_root.findByType(Tabs), 'onSelect', 1);

    expect(push).toBeCalled();
    expect(remove).toBeCalled();
    expect(setFieldValue).toBeCalled();

    expect(findAllByText(/ADRAVIL TAB 20 MG Physical/)).toBeTruthy();

    fireEvent(UNSAFE_root.findByType(InventoryTable), 'showProductHistory');

    expect(UNSAFE_root.findByType(HistoryTimeline)).toBeTruthy();
  });

  it('should delete properly', () => {
    const { UNSAFE_root } = render(
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

    fireEvent.press(UNSAFE_root.findByType(ProductListItem), product);
    fireEvent.press(UNSAFE_root.findByType(ActionCell), { id: 1 }, 1);
    fireEvent(UNSAFE_root.findByType(Tabs), 'onSelect', 1);

    expect(push).toBeCalled();
    expect(remove).toBeCalled();
    expect(setFieldValue).toBeCalled();

    fireEvent(UNSAFE_root.findByType(InventoryTable), 'showProductHistory');

    expect(UNSAFE_root.findByType(HistoryTimeline)).toBeTruthy();
  });
});
