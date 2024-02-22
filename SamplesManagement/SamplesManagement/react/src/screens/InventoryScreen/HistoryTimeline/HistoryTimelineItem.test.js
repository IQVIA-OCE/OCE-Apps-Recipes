import React from 'react';
import renderer from 'react-test-renderer';
import HistoryTimelineItem from './HistoryTimelineItem';
import { render } from '@testing-library/react-native';

const item = {
  recordType: {
    DeveloperName: 'AcknowledgementOfShipment',
    Name: '',
  },
  productName: '',
  transactionDateTime: '',
  lotNumber: '1337',
  quantity: '',
};

describe('HistoryTimelineItem', () => {
  it('should render properly', () => {
    const { getByText } = render(<HistoryTimelineItem item={item} />);

    expect(getByText(/1337/)).toBeTruthy();
  });
});
