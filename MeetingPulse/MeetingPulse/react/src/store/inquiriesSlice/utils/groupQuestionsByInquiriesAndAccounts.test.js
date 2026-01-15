import { groupQuestionsByInquiriesAndAccounts } from './groupQuestionsByInquiriesAndAccounts';
import { GROUPED_QUESTIONS, INQUIRIES_MOCK } from '../../../../__mocks__/inquiriesMocks';

describe('groupQuestionsByInquiriesAndAccounts', () => {
  it('should group correctly', () => {
    const result = groupQuestionsByInquiriesAndAccounts(INQUIRIES_MOCK);

    expect(result).toStrictEqual(GROUPED_QUESTIONS);
  });
});
