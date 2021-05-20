import React from 'react';
import renderer from 'react-test-renderer';
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

jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm', fromNow: () => '2 months ago'}));

describe('TimeLineItem', () => {
  it('Should render TimeLineItem component', () => {
    let tree = renderer.create(<TimeLineItem item={Adjustment} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={Disbursement} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={Order} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={TransferIn} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={TransferOut} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={Return} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={Adjustment2} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={Disbursement2} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={Order2} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={TransferIn2} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={TransferOut2} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={Return2} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer
      .create(<TimeLineItem item={AcknowledgementDetails2} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
