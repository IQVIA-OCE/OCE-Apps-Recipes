import React from 'react';
import RecordTypeSelectorScreen from './RecordTypeSelectorScreen';
import { useFetcher, useHandleData } from '../../hooks';
import { Button } from 'apollo-react-native';
import { render } from '@testing-library/react-native';

jest.mock('../../hooks');

const navigation = {
  navigate: jest.fn(),
};
const recordType = {
  Description: 'Record Type to differentiate Acknowledgement of Shipment',
  DeveloperName: 'AcknowledgementOfShipment',
  Name: 'Acknowledgement of Shipment',
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
    const { container } = render(<RecordTypeSelectorScreen navigation={navigation} />)

    container.findAllByType(Button)[0].props.onPress();
    expect(navigation.navigate).toBeCalledWith('Dashboard');

    container.findAllByType(Button)[1].props.onPress();
    expect(navigation.navigate).toBeCalledWith('Transaction', {
      recordType,
    });
  });

  it('should render component without data', async () => {
    const { getByTestId } = render(<RecordTypeSelectorScreen navigation={navigation} />)

    expect(getByTestId('RecordTypeSelectorScreen')).toBeTruthy();
  });
});
