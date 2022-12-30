import React from 'react';
import { Appearance } from 'react-native';
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
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    render(
      <App instanceId={INSTANCE_ID} />
    )

    const promise = Promise.resolve;

    await act(() => promise())
  })

  it('should render properly on iPhone in dark mode', async () => {
    commonConstants.isIphone = true;
    const mock = jest.fn();
    jest.spyOn(Appearance, 'getColorScheme').mockImplementation(mock);
    mock.mockReturnValueOnce('dark');

    jest
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    render(
      <App instanceId={INSTANCE_ID} />
    )

    const promise = Promise.resolve;

    await act(() => promise())
  })

  it('should render properly on iPad', async () => {
    commonConstants.isIphone = false;

    jest
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    render(
      <App instanceId={INSTANCE_ID} />
    )

    const promise = Promise.resolve;

    await act(() => promise())
  })

  it('should render properly on iPad in dark mode', async () => {
    commonConstants.isIphone = false;
    const mock = jest.fn();
    jest.spyOn(Appearance, 'getColorScheme').mockImplementation(mock);
    mock.mockReturnValueOnce('dark');

    jest
      .spyOn(activityPlanApi, "fetchActivityPlan")
      .mockResolvedValue(PRODUCTS_RESPONSE);
    jest
      .spyOn(activityPlanApi, "fetchAccounts")
      .mockResolvedValue(ACCOUNTS_RESPONSE);

    render(
      <App instanceId={INSTANCE_ID} />
    )

    const promise = Promise.resolve;

    await act(() => promise())
  })
});
