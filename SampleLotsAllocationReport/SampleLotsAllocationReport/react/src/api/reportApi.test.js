import * as reportApi from './reportApi';
import { sfNetAPI } from "@oce-apps/oce-apps-bridges";
import {
  testSamplesLotReportRecords,
  testTransactionRecords,
  testProductAllocationData,
  testLastInventoryDateData,
  testProductAllocationDetailData
} from "../__mocks__/testData";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    sfApiVersion: () => '',
    userID: () => '',
    locale: () => '',
    territory: () => '',
    userId: () => ''
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));


describe('reportApi', () => {
  beforeAll(() => {
    sfNetAPI.query = jest.fn();
  });
  it('should call fetchReportData for fetching total count of the record', async () => {
    const params = { isRecordCount: true };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ totalSize: 1000 });

    const response = await reportApi.fetchReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(1000);
  });

  it('should call fetchReportData default', async () => {
    const params = {};
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSamplesLotReportRecords });

    const response = await reportApi.fetchReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testSamplesLotReportRecords);
  });
  it('should call fetchReportData with sortoption', async () => {
    const params = { sortClause: 'Product__r.Name ASC' };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSamplesLotReportRecords });

    const response = await reportApi.fetchReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testSamplesLotReportRecords);
  });

  it('should call fetchTransactionReportData for a reportId', async () => {
    const params = { reportId: 'a5HO00000003q6RMAQ' };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testTransactionRecords });

    const response = await reportApi.fetchTransactionReportData({ ...params });
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testTransactionRecords);
  });
  it('should call fetchTransactionReportData for a reportId with search query,lastinvetory date and sort option', async () => {
    const params = {
      reportId: 'a5HO00000003q6RMAQ',
      searchQuery: 'Alodox',
      searchField: 'product',
      lastInventoryDate: '2022-04-10',
      sortClause: `SampleTransaction__r.RecordType.DeveloperName`
    };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testTransactionRecords });

    const response = await reportApi.fetchTransactionReportData({ ...params });
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testTransactionRecords);
  });
  it('should call fetchReportData with search by account name', async () => {
    const params = {
      searchQuery: 'BRIAN',
      searchField: 'account'
    };
    sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSamplesLotReportRecords });
    const response = await reportApi.fetchReportData(params);
    expect(response).toStrictEqual(testSamplesLotReportRecords);
  });
  it('should call fetchReportData with search by product name', async () => {
    const params = {
      searchQuery: 'Alodox',
      searchField: 'product'
    };
    sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSamplesLotReportRecords });
    const response = await reportApi.fetchReportData(params);
    expect(response).toStrictEqual(testSamplesLotReportRecords);
  });
  it('should call fetchReportData with search value and empty search field', async () => {
    const params = {
      searchQuery: 'Alodox',
      searchField: ''
    };
    sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testSamplesLotReportRecords });
    const response = await reportApi.fetchReportData(params);
    expect(response).toStrictEqual(testSamplesLotReportRecords);
  });


  it('should call fetchDTPReportData for fetching total count of the record', async () => {
    const params = { isRecordCount: true };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ totalSize: 1000 });

    const response = await reportApi.fetchDTPReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(1000);
  });

  it('should call fetchDTPReportData default', async () => {
    const params = {};
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testProductAllocationData });

    const response = await reportApi.fetchDTPReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testProductAllocationData);
  });
  it('should call fetchDTPDetailReportData for dtp report', async () => {
    const params = {};
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testProductAllocationDetailData });

    const response = await reportApi.fetchDTPDetailReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testProductAllocationDetailData);
  });

  it('should call fetchDTPDetailReportData for dtp report with search params', async () => {
    const params = {
      startDate: '2022-04-18',
      endDate: '2022-04-22',
      searchQuery: 'Alodox',
      searchField: 'product',
      sortClause: `Account__r.Name`
    };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: testProductAllocationDetailData });

    const response = await reportApi.fetchDTPDetailReportData(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testProductAllocationDetailData);
  });

  it('should call lastInventory date for sla transaction', async () => {
    const params = { reportId: 'a5HO00000003q6RMAQ' };
    const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: [testLastInventoryDateData] });

    const response = await reportApi.fetchLastInventoryCreatedDate(params);
    expect(spy).toHaveBeenCalled();
    expect(response).toStrictEqual(testLastInventoryDateData);
  });
});
