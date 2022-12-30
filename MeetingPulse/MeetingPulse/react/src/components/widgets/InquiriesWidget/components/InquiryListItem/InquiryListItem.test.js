import { fireEvent, render, act } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { navigator } from 'oce-apps-bridges';

import { InquiryListItem } from './InquiryListItem';
import { MOCK_ACCOUNT_WITH_INQUIRIES } from '../../../../../../__mocks__/inquiriesMocks';

jest.mock('oce-apps-bridges', () => ({
  navigator: {
    navigate: jest.fn(),
  },
  environment: {
    namespace: () => '',
  },
}));

describe('InsightListItem', () => {
  it('should render correctly', async () => {
    const { getByText, getAllByText } = render(<InquiryListItem account={MOCK_ACCOUNT_WITH_INQUIRIES} />);

    expect(getByText(/_Southern Baptist Hospital of Florida, Inc/i)).toBeTruthy();
    expect(getByText(/INQ-0001/i)).toBeTruthy();
    expect(getAllByText(/Lorem ipsum/i).length).toBe(6);
  });

  it('should navigate to inquiry details screen', () => {
    const { getByText } = render(<InquiryListItem account={MOCK_ACCOUNT_WITH_INQUIRIES} />);

    fireEvent.press(getByText(/INQ-0001/));

    expect(navigator.navigate).toHaveBeenCalledTimes(1);
    expect(navigator.navigate).toHaveBeenCalledWith({}, 'Inquiry__c', 'a6OO0000000CnlXMAS', 'present', 'view');
  });

  it('should handle error in navigation bridge', async () => {
    const promise = Promise.resolve();
    navigator.navigate.mockRejectedValueOnce(new Error('Test error in navigation bridge'));
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation();
    const { getByText } = render(<InquiryListItem account={MOCK_ACCOUNT_WITH_INQUIRIES} />);

    fireEvent.press(getByText(/INQ-0001/));

    await act(() => promise);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Something went wrong', 'Test error in navigation bridge');
  });
});
