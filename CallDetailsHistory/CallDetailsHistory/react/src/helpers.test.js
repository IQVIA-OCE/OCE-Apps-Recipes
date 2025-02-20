import * as callDetailsHistoryApi from './api/callDetailsHistoryApi';
import {
  generateColors,
  getChartMonths,
  getFilteredColors,
  getNormalizedChartData,
  getNormalizedData,
} from './helpers';
import { ACCOUNT_CALLS_MOCK, CALL_DETAILS_MOCK, NORMALIZED_DATA } from './mocks/dataMocks';

jest.mock('./api/callDetailsHistoryApi', () => ({
  fetchAccountCalls: jest.fn(),
  fetchCallDetails: jest.fn(),
}));

describe('helpers', () => {
  it('generateColors function should return array of generated colors', () => {
    const colors = generateColors(5);

    expect(colors.length).toEqual(5);
  });

  it('getFilteredColors function should return array of generated colors only for selected products', () => {
    const dataWithColors = getFilteredColors(
      [{ productId: '0' }, { productId: '1' }],
      [{ productId: '1' }]
    );

    expect(dataWithColors).toEqual(['#2F6497']);
  });

  it('getNormalizedData function should return filtered calls details array', async () => {
    callDetailsHistoryApi.fetchAccountCalls.mockResolvedValueOnce(ACCOUNT_CALLS_MOCK);
    callDetailsHistoryApi.fetchCallDetails.mockResolvedValueOnce(CALL_DETAILS_MOCK);

    const data = await getNormalizedData('0');

    expect(data).toStrictEqual(NORMALIZED_DATA);
  });

  it('getNormalizedData function should throw error if no account calls', async () => {
    callDetailsHistoryApi.fetchAccountCalls.mockResolvedValueOnce([]);

    try {
      await getNormalizedData('0');
    } catch (error) {
      expect(error).toStrictEqual(Error('This account has no recent calls'));
    }
  });

  it('getChartMonths function should return month labels array for chart', () => {
    let chartMonth;
    chartMonth = getChartMonths();

    expect(chartMonth.length).toEqual(12);

    chartMonth = getChartMonths(5);

    expect(chartMonth.length).toEqual(5);
  });

  it('getNormalizedChartData should return normalized call data for chart', () => {
    const chartData = getNormalizedChartData(NORMALIZED_DATA, 12);

    expect(chartData.length).toEqual(2);
    expect(chartData[0].data.length).toEqual(12);
    expect(chartData[1].data.length).toEqual(12);
  });
});
