import React from 'react';
import TimeLineItem from './TimeLineItem';
import {
  AcknowledgementDetails,
  TransferIn,
  TransferIn2,
} from './mock';
import { render } from '@testing-library/react-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm', fromNow: () => '2 months ago'}));

describe('TimeLineItem', () => {
  it('Should render TimeLineItem component', () => {
    const { getByText } = render(<TimeLineItem item={TransferIn} />);

    expect(getByText(/Product samples received/)).toBeTruthy();
  });

  it('Should render TimeLineItem component', () => {
    const { getByText } = render(<TimeLineItem item={TransferIn2} />);

    expect(getByText(/Product samples received/)).toBeTruthy();
  });

  it('Should render TimeLineItem component', () => {
    const { getByText } = render(<TimeLineItem item={AcknowledgementDetails} />);

    expect(getByText(/Product samples to acknowledge/)).toBeTruthy();
  });
});
