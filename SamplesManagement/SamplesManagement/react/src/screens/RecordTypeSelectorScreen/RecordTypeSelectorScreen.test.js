import React from 'react';
import RecordTypeSelectorScreen from './RecordTypeSelectorScreen';
import { Button } from '@oce-apps/apollo-react-native';
import { act, fireEvent, render } from '@testing-library/react-native';

const navigation = {
  navigate: jest.fn(),
};
const recordType = {
  Description: 'Record Type to differentiate Acknowledgment of Shipment',
  DeveloperName: 'AcknowledgementOfShipment',
  Id: '0120k000000QjLfAAK',
  Name: 'Acknowledgement of Shipment',
};

describe('RecordTypeSelectorScreen', () => {
  it('should render component', async () => {
    const { UNSAFE_root } = render(<RecordTypeSelectorScreen navigation={navigation} />)
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    expect(navigation.navigate).toBeCalledWith('Dashboard');

    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    expect(navigation.navigate).toBeCalledWith('Transaction', {
      recordType,
    });
  });

  it('should render component without data', async () => {
    const { getByTestId } = render(<RecordTypeSelectorScreen navigation={navigation} />);
    act(() => jest.runAllTimers());

    expect(getByTestId('RecordTypeSelectorScreen')).toBeTruthy();
  });
});
