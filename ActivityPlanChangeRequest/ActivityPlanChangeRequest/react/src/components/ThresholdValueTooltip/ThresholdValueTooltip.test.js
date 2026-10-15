import React from 'react';
import { useSelector } from 'react-redux'
import { render } from '@testing-library/react-native';
import ThresholdValueTooltip from './ThresholdValueTooltip';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('ThresholdValueTooltip', () => {
  it('should render correctly', () => {
    useSelector
      .mockImplementationOnce(() => ({
        activityPlan: {
          allowedThreshold: 6,
          apcrApproved: 3,
          relatedGoalsSize: 2
        }
      }))
    const { getByText } = render(
      <ThresholdValueTooltip />
    );

    expect(getByText(/Threshold Value/i)).toBeTruthy();
  })

  it('extended version should render correctly', () => {
    useSelector
      .mockImplementationOnce(() => ({
        activityPlan: {
          allowedThreshold: 6,
          apcrApproved: 3,
          relatedGoalsSize: 2
        }
      }))
    const { getByText } = render(
      <ThresholdValueTooltip extended={true}/>
    );

    expect(getByText(/Threshold Value/i)).toBeTruthy();
  })
})
