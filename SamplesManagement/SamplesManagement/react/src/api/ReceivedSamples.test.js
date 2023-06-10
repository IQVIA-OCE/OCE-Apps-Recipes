import api from '../utils/api';
import {
  fetchReceivedSamplesData,
  fetchReceivedSamplesListId,
} from './ReceivedSamples';
import {
  mapReceivedSamples
} from '../screens/DashboardScreen/ReceivedSamplesWidget/utils';

jest.mock('../screens/DashboardScreen/ReceivedSamplesWidget/utils');
jest.mock('moment', () => () => ({ format: () => 'May 3, 2020 06:19 pm' }));

describe('ReceivedSamples', () => {
  beforeAll(() => {
    mapReceivedSamples.mockReturnValue('');
  });

  it('fetchReceivedSamplesData: TransferIn', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchReceivedSamplesData(6, 'TransferIn');
    expect(spy).toHaveBeenCalled();
  });

  it('fetchReceivedSamplesData: AcknowledgementOfShipment', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchReceivedSamplesData(6, 'AcknowledgementOfShipment');
    expect(spy).toHaveBeenCalled();
  });

  it('fetchReceivedSamplesListId', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchReceivedSamplesListId();
    expect(spy).toHaveBeenCalled();
  });

});
