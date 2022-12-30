import React from 'react';
import renderer from 'react-test-renderer';
import TimeLineItem from './TimeLineItem';
import {
  AcknowledgementDetails,
  TransferIn,
  TransferIn2,
} from './mock';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm', fromNow: () => '2 months ago'}));

describe('TimeLineItem', () => {
  it('Should render TimeLineItem component', () => {
    tree = renderer.create(<TimeLineItem item={TransferIn} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer.create(<TimeLineItem item={TransferIn2} />).toJSON();
    expect(tree).toMatchSnapshot();

    tree = renderer
      .create(<TimeLineItem item={AcknowledgementDetails} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
