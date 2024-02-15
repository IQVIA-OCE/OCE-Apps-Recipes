import React from 'react';
import { InventoryContext } from '../InventoryContext';
import HistoryTimeline from './HistoryTimeline';
import { render } from '@testing-library/react-native';

const product = {
  sampleProductId: '1',
  lotNumberId: '1',
  label: 'label',
  detailLabel: 'detailLabel',
};

const item = {
  productId: '1',
  lotId: '1',
  recordType: {
    DeveloperName: 'AcknowledgementOfShipment',
    Name: '',
  },
  productName: '',
  transactionDateTime: '',
  lotNumber: '',
  quantity: '',
};

describe('HistoryTimeline', () => {
  it('should render properly', () => {
    const { queryByText, rerender } = render(
      <InventoryContext.Provider value={{ productsHistory: [item] }}>
        <HistoryTimeline product={product} />
      </InventoryContext.Provider>
    );

    expect(queryByText(/detailLabel/)).toBeTruthy();

    rerender(
      <InventoryContext.Provider value={{ productsHistory: [item] }}>
        <HistoryTimeline />
      </InventoryContext.Provider>
    )

    expect(queryByText(/detailLabel/)).toBeNull();
  });
});
