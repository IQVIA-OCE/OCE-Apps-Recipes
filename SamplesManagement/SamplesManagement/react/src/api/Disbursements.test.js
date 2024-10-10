import api from '../utils/api';
import { fetchDisbursements } from './Disbursements';
import moment from 'moment';

jest.unmock('./Disbursements');

describe('AppContext', () => {
  it('fetchUser', () => {
    const date = moment()
      .startOf('month')
      .subtract('2', 'months')
      .format('YYYY-MM-DD');

    const spy = jest.spyOn(api, 'query');

    fetchDisbursements(date);

    const query = `select OCE__Product__r.Id, OCE__Product__r.Name productName, Sum(OCE__Quantity__c) totalQuantity, CALENDAR_YEAR(OCE__SampleTransaction__r.OCE__TransactionDateTime__c) year, CALENDAR_MONTH(OCE__SampleTransaction__r.OCE__TransactionDateTime__c) month from OCE__SampleTransactionDetail__c where OCE__SampleTransaction__r.RecordType.Name = 'Disbursement' and ((DAY_ONLY(OCE__SampleTransaction__r.OCE__TransactionDateTime__c) >= ${date}) and (DAY_ONLY(OCE__SampleTransaction__r.OCE__TransactionDateTime__c) <= THIS_MONTH)) group by OCE__Product__r.Name, OCE__Product__r.Id, CALENDAR_YEAR(OCE__SampleTransaction__r.OCE__TransactionDateTime__c), CALENDAR_MONTH(OCE__SampleTransaction__r.OCE__TransactionDateTime__c) order by CALENDAR_YEAR(OCE__SampleTransaction__r.OCE__TransactionDateTime__c), CALENDAR_MONTH(OCE__SampleTransaction__r.OCE__TransactionDateTime__c)`;

    expect(spy).toHaveBeenCalledWith(query);
  });
});
