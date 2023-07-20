import { mapJsonTemplate, mapReport, mapTemplate } from "./reportMappers";
import {
  mappedEmptyReports, mappedJSON,
  mappedReports, mappedTemplates,
  testAccountItems,
  testEmptyRecords,
  testNullRecords,
  testSampleLimitErrorRecords,
  testTemplates
} from "./testData";

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

describe('mapTemplate', () => {
  it('return mapReport', () => {
    expect(mapReport(testSampleLimitErrorRecords)).toStrictEqual(mappedReports);
    expect(mapReport(testEmptyRecords)).toStrictEqual(mappedEmptyReports);
    expect(mapReport(testNullRecords)).toStrictEqual(mappedEmptyReports);
  });

  it('return mapJsonTemplate', () => {
    expect(mapJsonTemplate(testAccountItems.limitJsonTemplate, 'a4sO00000000satIAA')).toStrictEqual(mappedJSON);
  });

  it('return mapTemplate', () => {
    expect(mapTemplate(testTemplates)).toStrictEqual(mappedTemplates);
  });
});
