export const normalizeRecordTypes = data =>
  data.filter(recordType => recordType.DeveloperName !== 'Disbursement');
