import { NAMESPACE } from '../constants';

export const ACCOUNTS_RAW = [
  { [`${NAMESPACE}KanaName__c`]: null, Id: '0010k00001UXI2AAAX', Name: 'IS BC Contact #1' },
  { [`${NAMESPACE}KanaName__c`]: null, Name: 'GLEN LEE RICCA', Id: '0010k00001TmnNCAAZ' },
  { [`${NAMESPACE}KanaName__c`]: null, Id: '0010k00001TmnNDAAZ', Name: 'STEVEN SCOTT NEMETH' },
  { Id: '0010k00001TmnNEAAZ', Name: 'MARK BERNARD DEYOUNG', [`${NAMESPACE}KanaName__c`]: null },
  { Name: 'LEO GONZALES PEPA', Id: '0010k00001TmnNFAAZ', [`${NAMESPACE}KanaName__c`]: null },
];
export const ACCOUNTS_MAPPED = [
  { id: '0010k00001UXI2AAAX', name: 'IS BC Contact #1', kanaName: 'IS BC Contact #1 kana' },
  { id: '0010k00001TmnNCAAZ', name: 'GLEN LEE RICCA', kanaName: 'GLEN LEE RICCA kana' },
  { id: '0010k00001TmnNDAAZ', name: 'STEVEN SCOTT NEMETH', kanaName: 'STEVEN SCOTT NEMETH kana' },
  { id: '0010k00001TmnNEAAZ', name: 'MARK BERNARD DEYOUNG', kanaName: 'MARK BERNARD DEYOUNG kana' },
  { id: '0010k00001TmnNFAAZ', name: 'LEO GONZALES PEPA', kanaName: 'LEO GONZALES PEPA kana' },
];
export const MORE_ACCOUNTS_RAW = [
  { Id: '0010k00001TmnNQAAZ', Name: 'ASHOK KUMAR', [`${NAMESPACE}KanaName__c`]: null },
  { [`${NAMESPACE}KanaName__c`]: null, Id: '0010k00001TmnNRAAZ', Name: 'STEPHEN LATIMER PIERSON' },
  { Id: '0010k00001TmnNSAAZ', Name: 'WILLIAM RAY STAPLETON', [`${NAMESPACE}KanaName__c`]: null },
  { [`${NAMESPACE}KanaName__c`]: null, Name: 'MICHAEL FRANCIS MARZEC', Id: '0010k00001TmnNTAAZ' },
  { Id: '0010k00001TmnNUAAZ', Name: 'WINSTON THEIN-WAI', [`${NAMESPACE}KanaName__c`]: null },
];
