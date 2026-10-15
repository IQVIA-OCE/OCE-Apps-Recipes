import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import OutstandingSampleRequestListItem from './OutstandingSampleRequestListItem';
import { View } from 'react-native';
import { navigator } from '@oce-apps/oce-apps-bridges';

describe('OutstandingSampleRequestListItem', () => {
  const sampleMock = {
    quantity: 1,
    name: 'SampleName',
    Id: '123',
  };
  it('OutstandingSampleRequestListItem should render', () => {
    const { getByText } = render(<OutstandingSampleRequestListItem name={'testName'} samples={[{ ...sampleMock }]} />);
    expect(getByText(/testName/i)).toBeTruthy();
    expect(getByText(`${sampleMock.name} (Qty ${sampleMock.quantity})`)).toBeTruthy();
  });

  it('OutstandingSampleRequestListItem should render empty samples', () => {
    const { UNSAFE_root } = render(<OutstandingSampleRequestListItem name={'testName'} />);
    const samplesWrapper = UNSAFE_root.findAllByType(View)[1];
    expect(samplesWrapper).toBeEmpty();
  });

  it('Should succesfully press and call openDeepLink', () => {
    const { getByTestId } = render(<OutstandingSampleRequestListItem name={'testName'} samples={[{ ...sampleMock }]} />);
    const sampleItem = getByTestId('sampleItem-123');
    fireEvent.press(sampleItem);
    expect(navigator.openDeeplink).toHaveBeenCalled();
  });
});
