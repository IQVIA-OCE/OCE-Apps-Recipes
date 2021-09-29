import React from 'react';
import renderer from 'react-test-renderer';
import HistoryTimelineItem from './HistoryTimelineItem';

const item = {
  recordType: {
    DeveloperName: 'AcknowledgementOfShipment',
    Name: '',
  },
  productName: '',
  transactionDateTime: '',
  lotNumber: '',
  quantity: '',
};
describe('HistoryTimelineItem', () => {
  it('should render properly', () => {
    const tree = renderer.create(<HistoryTimelineItem item={item} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
