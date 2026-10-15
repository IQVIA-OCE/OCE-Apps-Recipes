import * as reportApi from './reportApi';
import { sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { testSampleLimitErrorRecords, testSampleLimitErrorRecordsWithSearch, testTemplates } from "../utils/testData";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    sfApiVersion: () => '',
    userID: () => '',
    locale: () => '',
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));


describe('reportApi', () => {
  beforeAll(() => {
    sfNetAPI.query = jest.fn();
  });

  it('should call fetchReportData, order by accountName', async () => {
    const params = {
      limit: 15,
      offset: 0,
      searchQuery: '',
      templateFilter: '',
      sortField: 'accountName',
      sortOrder: '',
    };

    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSampleLimitErrorRecords });

    const response = await reportApi.fetchReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testSampleLimitErrorRecords);
  });

  it('should call fetchReportData, order by sampleName', async () => {
    const params = { sortField: 'sampleName' };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSampleLimitErrorRecords });

    const response = await reportApi.fetchReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testSampleLimitErrorRecords);
  });

  it('should call fetchReportData, order by accountSpecialty', async () => {
    const params = { sortField: 'accountSpecialty' };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSampleLimitErrorRecords });

    const response = await reportApi.fetchReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testSampleLimitErrorRecords);
  });

  it('should call fetchReportData default', async () => {
    const params = {};
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSampleLimitErrorRecords });

    const response = await reportApi.fetchReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testSampleLimitErrorRecords);
  });

  it('should call fetchReportData with search and filter', async () => {
    const params = {
      searchQuery: 'BRIAN',
      templateFilter: 'ItalyClassA',
      sortField: 'limitTemplateName',
      sortOrder: '',
    };

    sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSampleLimitErrorRecordsWithSearch });

    const response = await reportApi.fetchReportData(params);
    expect(response).toStrictEqual(testSampleLimitErrorRecordsWithSearch);
  });

  it('should call fetchReportData, return empty array', async () => {
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: [] });

    const response = await reportApi.fetchReportData({  });
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual([]);
  });

  it('should call fetchLimitTemplates default', async () => {
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testTemplates });

    const response = await reportApi.fetchLimitTemplates();
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testTemplates);
  });

  it('fetchReportData should return error if API returns error', async () => {
    sfNetAPI.query.mockImplementationOnce(() => { throw 'Test error' });
    await expect(() => reportApi.fetchReportData({ })).rejects.toEqual('Test error');
  });

  it('fetchLimitTemplates should return error if API returns error', async () => {
    sfNetAPI.query.mockImplementationOnce(() => { throw 'Test error' });
    await expect(() => reportApi.fetchLimitTemplates()).rejects.toEqual('Test error');
  });
});
