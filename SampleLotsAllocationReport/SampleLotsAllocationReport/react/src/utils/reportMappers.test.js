import { mapReport, mapTransaction, mapDtpRecord, mapDtpAllocationDetails } from "./reportMappers";
import {
  mappedEmptyReports,
  mappedReports,
  testEmptyRecords,
  testTransactionRecords,
  testProductAllocationData,
  testSamplesLotReportRecords,
  mappedTransactions,
  mappedProductAllocationData,
  mappedEmptyTransactions,
  testEmptyTransactionRecords,
  testProductAllocationEmptyData,
  emptyProductAllocations,
  testProductAllocationDetailData,
  mappedProductAllocationDetailData,
  emptyTestProductAllocationDetailData,
  mappedEmptyProductAllocationDetailData

} from "../__mocks__/testData";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
    territory: () => '',
    userId: () => '',
  },
}));

describe('mapRecords', () => {
  it('return mapReport', () => {
    expect(mapReport(testSamplesLotReportRecords)).toStrictEqual(mappedReports);
    expect(mapReport(testEmptyRecords)).toStrictEqual(mappedEmptyReports);
  });
  it('return mapTransaction', () => {
    expect(mapTransaction(testTransactionRecords)).toStrictEqual(mappedTransactions);
    expect(mapTransaction(testEmptyTransactionRecords)).toStrictEqual(mappedEmptyTransactions);
  });
  it('return mapDtpRecord', () => {
    expect(mapDtpRecord(testProductAllocationData)).toStrictEqual(mappedProductAllocationData);
    expect(mapDtpRecord(testProductAllocationEmptyData)).toStrictEqual(emptyProductAllocations);
  });

});
