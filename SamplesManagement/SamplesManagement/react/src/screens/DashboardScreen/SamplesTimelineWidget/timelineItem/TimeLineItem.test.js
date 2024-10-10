import React from 'react';
import TimeLineItem from './TimeLineItem';
import {
  AcknowledgementDetails2,
  Adjustment,
  Adjustment2,
  Disbursement,
  Disbursement2,
  Order,
  Order2,
  Return,
  Return2,
  TransferIn,
  TransferIn2,
  TransferOut,
  TransferOut2,
} from './mock';

import {render} from '@testing-library/react-native';

jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm', fromNow: () => '2 months ago'}));

describe('TimeLineItem', () => {
  it('Should render TimeLineItem component', () => {
    const {getByTestId, rerender} = render(<TimeLineItem item={Adjustment}/>);

    expect(getByTestId('AdjustmentDetails')).toBeTruthy();

    rerender(<TimeLineItem item={Disbursement}/>);

    expect(getByTestId('DisbursementDetails')).toBeTruthy();

    rerender(<TimeLineItem item={Order}/>);

    expect(getByTestId('OrderDetails')).toBeTruthy();

    rerender(<TimeLineItem item={TransferIn}/>);

    expect(getByTestId('TransferInDetails')).toBeTruthy();

    rerender(<TimeLineItem item={TransferOut}/>);

    expect(getByTestId('TransferOutDetails')).toBeTruthy();

    rerender(<TimeLineItem item={Return}/>);

    expect(getByTestId('ReturnDetails')).toBeTruthy();

    rerender(<TimeLineItem item={Adjustment2}/>);

    expect(getByTestId('AdjustmentDetails')).toBeTruthy();

    rerender(<TimeLineItem item={Disbursement2}/>);

    expect(getByTestId('DisbursementDetails')).toBeTruthy()

    rerender(<TimeLineItem item={Order2}/>);

    expect(getByTestId('OrderDetails')).toBeTruthy()

    rerender(<TimeLineItem item={TransferIn2}/>);

    expect(getByTestId('TransferInDetails')).toBeTruthy()

    rerender(<TimeLineItem item={TransferOut2}/>);

    expect(getByTestId('TransferOutDetails')).toBeTruthy()

    rerender(<TimeLineItem item={Return}/>);

    expect(getByTestId('ReturnDetails')).toBeTruthy();

    rerender(<TimeLineItem item={Return2}/>);

    expect(getByTestId('ReturnDetails')).toBeTruthy();

    rerender(<TimeLineItem item={AcknowledgementDetails2}/>);

    expect(getByTestId('AcknowledgementOfShipmentDetails')).toBeTruthy();
  });
});
