import React from 'react';
import RN from 'react-native';
import { render, act } from '@testing-library/react-native';
import App from './App';
import * as commonConstants from './src/constants';
import * as activityPlanApi from './src/api/activityPlanApi';
import { ACCOUNTS_RESPONSE, PRODUCTS_RESPONSE } from './__mocks__/data';


const INSTANCE_ID = '556E3984-FA45-4594-B13E-FCE318926540';

describe('Application', () => {
  it('should render properly on iPhone', async () => {
    commonConstants.isIphone = true;

    jest
      .spyOn(activityPlanApi, "fetchAllActivityPlans")
      .mockResolvedValue(PRODUCTS_RESPONSE.records);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE.records);

    const { queryAllByText } = render(
      <App instanceId={INSTANCE_ID} />
    )
    await act(() => Promise.resolve());

    await expect(queryAllByText('Disbursed').length).toBe(1);
    await expect(queryAllByText('Remaining').length).toBe(1);
  })

  it('should render properly on iPad', async () => {
    commonConstants.isIphone = false;

    jest
      .spyOn(activityPlanApi, "fetchAllActivityPlans")
      .mockResolvedValue(PRODUCTS_RESPONSE.records);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE.records);

    const { queryAllByText } = render(
      <App instanceId={INSTANCE_ID} />
    )

    await act(() => Promise.resolve());

    await expect(queryAllByText('Disbursed').length).toBe(1);
    await expect(queryAllByText('Remaining').length).toBe(1);
  })

  it('should render with dark theme', async () => {
    const mock = jest.fn();

    commonConstants.isIphone = false;

    jest.spyOn(RN, 'useColorScheme').mockImplementation(mock);

    mock.mockReturnValueOnce('dark');

    jest
      .spyOn(activityPlanApi, "fetchAllActivityPlans")
      .mockResolvedValue(PRODUCTS_RESPONSE.records);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE.records);


    const { queryAllByText } = render(
      <App instanceId={INSTANCE_ID} />
    )

    await act(() => Promise.resolve());

    await expect(queryAllByText('Disbursed').length).toBe(1);
    await expect(queryAllByText('Remaining').length).toBe(1);
  })
});


