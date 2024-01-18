import { act, render, waitFor } from '@testing-library/react-native';
import { Checkbox, IconButton, Menu, Provider } from 'apollo-react-native';
import React from 'react';
import { NORMALIZED_DATA } from '../mocks/dataMocks';
import ProductsMenu from './ProductsMenu';

jest.spyOn(global, 'setTimeout');

describe('ProductsMenu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', async () => {
    const { queryByText, container } = render(
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
      container.findByType(IconButton).props.onPress();
    });

    await waitFor(() => {
      expect(container.findAllByType(Checkbox).length).toEqual(2);
      expect(queryByText(/B:Alodox/)).toBeTruthy();
    });
  });

  it('should close Menu', async () => {
    const { queryByText, container } = render(
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
      container.findByType(IconButton).props.onPress();
    });

    act(() => {
      container.findByType(Menu).props.onDismiss();
    });

    await waitFor(() => {
      expect(container.findAllByType(Checkbox).length).toEqual(0);
      expect(queryByText(/B:Alodox/)).toBeNull();
    });
  });

  it('should call passed functions when checkboxes were changed', async () => {
    const setSelectedProductsMock = jest.fn();
    const setLoadingMock = jest.fn();
    const { container } = render(
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

    act(() => {
      container.findByType(IconButton).props.onPress();
    });

    await waitFor(() => {
      container.findByType(Checkbox.Group).props.onChange(['pr1']);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(container.findByType(Checkbox.Group).props.value).toEqual(['pr1']);
      expect(setLoadingMock).toHaveBeenCalled();
      expect(setSelectedProductsMock).toHaveBeenCalled();
      expect(setSelectedProductsMock).toHaveBeenCalledWith(['pr1']);
    });
  });
});
