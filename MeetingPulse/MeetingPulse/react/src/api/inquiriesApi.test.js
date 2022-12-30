import api from '../utils/api';
import { fetchInquiryQuestions } from './inquiriesApi';

jest.mock('../utils/api', () => ({
  queryOffline: jest.fn(),
}));

describe('inquiriesApi', () => {
  it('fetchInquiryQuestions', async () => {
    await fetchInquiryQuestions([1]);
    expect(api.queryOffline).toHaveBeenCalled();
  });
});
