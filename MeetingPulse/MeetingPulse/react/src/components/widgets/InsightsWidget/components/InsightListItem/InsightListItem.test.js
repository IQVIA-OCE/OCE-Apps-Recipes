import { fireEvent, render, act } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { navigator } from '@oce-apps/oce-apps-bridges';

import { InsightListItem } from './InsightListItem';
import { MOCK_ACCOUNT_WITH_INSIGHTS } from '../../../../../../__mocks__/insightsMocks';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  navigator: {
    navigate: jest.fn(),
  },
  environment: {
    namespace: () => '',
  },
}));

describe('InsightListItem', () => {
  it('should render correctly', async () => {
    const { getByText } = render(<InsightListItem account={MOCK_ACCOUNT_WITH_INSIGHTS} />);

    expect(getByText(/Aaa BBb/i)).toBeTruthy();
    expect(getByText(/Test insight 1/i)).toBeTruthy();
    expect(getByText(/Test question 1/i)).toBeTruthy();
  });

  it('should navigate to insight details screen', () => {
    const { getByText } = render(<InsightListItem account={MOCK_ACCOUNT_WITH_INSIGHTS} />);

    fireEvent.press(getByText(/a3r0p00000059TmAAI/));

    expect(navigator.navigate).toHaveBeenCalledTimes(1);
    expect(navigator.navigate).toHaveBeenCalledWith({}, 'Insight__c', 'a3r0p00000059TmAAI', 'present', 'view');
  });

  it('should handle error in navigation bridge', async () => {
    const promise = Promise.resolve();
    navigator.navigate.mockRejectedValueOnce(new Error('Test error in navigation bridge'));
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation();
    const { getByText } = render(<InsightListItem account={MOCK_ACCOUNT_WITH_INSIGHTS} />);

    fireEvent.press(getByText(/a3r0p00000059TmAAI/));

    await act(() => promise);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Something went wrong', 'Test error in navigation bridge');
  });
});
