import React from 'react';
import ProductsTable from './ProductsTable';
import { render } from '@testing-library/react-native';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

describe('ProductsTable', () => {
  it('should render component', () => {
    const { getByTestId } = render(
      <ProductsTable
        rows={[]}
        showProductAllocationRemaining={false}
      />
    );

    expect(getByTestId("ProductsTable")).toBeTruthy();
  });

  it('should render component with showing remaining product allocations', () => {
    const { getByText } = render(
      <ProductsTable
        rows={[]}
        showProductAllocationRemaining={true}
      />
    );

    expect(getByText('REMAINING ALLOCATION')).toBeTruthy();
  });
});
