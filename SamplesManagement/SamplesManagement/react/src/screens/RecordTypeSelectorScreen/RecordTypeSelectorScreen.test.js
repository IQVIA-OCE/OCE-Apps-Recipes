import React from 'react';
import RecordTypeSelectorScreen from './RecordTypeSelectorScreen';
import { useFetcher, useHandleData } from '../../hooks';
import { Button } from '@oce-apps/apollo-react-native';
import { render } from '@testing-library/react-native';

jest.mock('../../hooks');

const navigation = {
  navigate: jest.fn(),
};
const recordType = {
  Description: 'Record Type to differentiate Acknowledgment of Shipment',
  DeveloperName: 'AcknowledgementOfShipment',
  Name: 'Acknowledgment of Shipment',
};
describe('RecordTypeSelectorScreen', () => {
  beforeEach(() => {
    useFetcher
      .mockReturnValueOnce([
        {
          data: [recordType],
        },
      ])
      .mockReturnValueOnce([{ data: [] }]);
  });

  useHandleData.mockImplementation(data => fn => fn(data.data));

  it('should render component', async () => {
    const { UNSAFE_root } = render(<RecordTypeSelectorScreen navigation={navigation} />)

    UNSAFE_root.findAllByType(Button)[0].props.onPress();
    expect(navigation.navigate).toBeCalledWith('Dashboard');

    UNSAFE_root.findAllByType(Button)[1].props.onPress();
    expect(navigation.navigate).toBeCalledWith('Transaction', {
      recordType,
    });
  });

  it('should render component without data', async () => {
    const { getByTestId } = render(<RecordTypeSelectorScreen navigation={navigation} />)

    expect(getByTestId('RecordTypeSelectorScreen')).toBeTruthy();
  });
});
