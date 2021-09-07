import React from 'react';
import renderer from 'react-test-renderer';
import { InventoryContext } from '../InventoryContext';
import HistoryTimeline from './HistoryTimeline';

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
    const tree = renderer.create(
      <InventoryContext.Provider value={{ productsHistory: [item] }}>
        <HistoryTimeline product={product} />
      </InventoryContext.Provider>
    );

    expect(tree.toJSON()).toMatchSnapshot();

    tree.update(
      <InventoryContext.Provider value={{ productsHistory: [item] }}>
        <HistoryTimeline />
      </InventoryContext.Provider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
