import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Checkbox, IconButton, Menu, Provider } from '@oce-apps/apollo-react-native';
import React from 'react';
import { NORMALIZED_DATA } from '../mocks/dataMocks';
import ProductsMenu from './ProductsMenu';

jest.spyOn(global, 'setTimeout');

describe('ProductsMenu', () => {
  beforeEach(() => {
    jest.useFakeTimers({advanceTimers: true});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', async () => {
    const { queryByText, UNSAFE_root } = render(
      <Provider>
        <ProductsMenu
          data={NORMALIZED_DATA}
          selectedProducts={['pr0']}
          setSelectedProducts={jest.fn()}
          setLoading={jest.fn()}
          disabled={false}
        />
      </Provider>,
    );

    act(() => {
      UNSAFE_root.findByType(IconButton).props.onPress();
    });

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Checkbox).length).toEqual(2);
      expect(queryByText(/B:Alodox/)).toBeTruthy();
    });
  });

  it('should close Menu', async () => {
    const { queryByText, UNSAFE_root } = render(
      <Provider>
        <ProductsMenu
          data={NORMALIZED_DATA}
          selectedProducts={['pr0']}
          setSelectedProducts={jest.fn()}
          setLoading={jest.fn()}
          disabled={false}
        />
      </Provider>,
    );

    act(() => {
      UNSAFE_root.findByType(IconButton).props.onPress();
    });

    act(() => {
      UNSAFE_root.findByType(Menu).props.onDismiss();
    });

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Checkbox).length).toEqual(0);
      expect(queryByText(/B:Alodox/)).toBeNull();
    });
  });

  it('should call passed functions when checkboxes were changed', async () => {
    const setSelectedProductsMock = jest.fn();
    const setLoadingMock = jest.fn();
    const { UNSAFE_root } = render(
      <Provider>
        <ProductsMenu
          data={NORMALIZED_DATA}
          selectedProducts={['pr0']}
          setSelectedProducts={setSelectedProductsMock}
          setLoading={setLoadingMock}
          disabled={false}
        />
      </Provider>,
    );

    fireEvent.press(UNSAFE_root.findByType(IconButton));
    const CheckboxGroup = await waitFor(() => UNSAFE_root.findByType(Checkbox.Group));

    act( () => {
      CheckboxGroup.props.onChange(['pr1']);
    });
    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(UNSAFE_root.findByType(Checkbox.Group).props.value).toEqual(['pr1']);
      expect(setLoadingMock).toHaveBeenCalled();
      expect(setSelectedProductsMock).toHaveBeenCalled();
      expect(setSelectedProductsMock).toHaveBeenCalledWith(['pr1']);
    });
  });
});
