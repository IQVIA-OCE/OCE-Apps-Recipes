import {normalizeLocation} from "./utils";

jest.mock('../../../constants/constants', () => ({
  NAMESPACE: 'OCE__'
}));

describe('StorageLocationWidget utils', () => {
  it('normalizeLocation: should return empty string', () => {
    const location = normalizeLocation([])
    expect(location).toMatch('')
  })

  it('normalizeLocation: should return address', () => {
    const address = 'Default address 1';
    const location = normalizeLocation([{'OCE__FullAddress__c': 'Default address 1'}])
    expect(location).toMatch(address)
  })
})