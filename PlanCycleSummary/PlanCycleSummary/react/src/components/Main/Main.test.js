import React from 'react';
import { render } from '@testing-library/react-native';
import Main from './Main';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import {
  fetchPlanCycle,
  fetchHoursInWorkDay,
  fetchBusinessHoursConfig,
  fetchWorkingDaysConfig,
  fetchBusinessHours,
  fetchHolidayDaysConfig,
  fetchHolidays,
  fetchTimeOffDaysConfig,
  fetchTOTSettings,
  fetchTOTs,
} from '../../api';

jest.mock('../../api');

jest.mock('@oce-apps/oce-apps-bridges', () => {
  const actualEnvironment = jest.requireActual('@oce-apps/oce-apps-bridges');

  return {
    ...actualEnvironment,
    environment: {
      ...actualEnvironment.environment,
      namespace: jest.fn(() => 'OCE__'),
      territory: jest.fn(() => ({ name: 'Mocked Territory' })),
      organizationId: jest.fn(() => 'mocked-id'),
    },
  };
});

describe('Main', () => {
  fetchPlanCycle.mockImplementation(async () => {
    return [
      [
        {
          Id: 'a462C000000NU2YQAW',
          OCE__EndDate__c: '2024-03-31',
          OCE__StartDate__c: '2024-03-01',
          OCE__Territory__c: 'TM - SPC - Albany NY 20B03T09',
          OCE__Type__c: 'AccountGoal',
        },
        {
          Id: 'a462C000000NU2nQAG',
          OCE__EndDate__c: '2024-03-31',
          OCE__StartDate__c: '2024-03-01',
          OCE__Territory__c: 'TM - SPC - Albany NY 20B03T09',
          OCE__Type__c: 'WeightedTerritoryGoals',
        },
        {
          Id: 'a462C000000NU2nQAG',
          OCE__EndDate__c: '2024-03-31',
          OCE__StartDate__c: '2024-03-01',
          OCE__Territory__c: 'TM - SPC - Albany NY 20B03T09',
          OCE__Type__c: 'WeightedTerritoryGoals',
        },
      ],
    ];
  });
  fetchHoursInWorkDay.mockImplementation(async () => {
    return [[{ OCE__HoursInWorkDay__c: 8 }]];
  });
  fetchBusinessHoursConfig.mockImplementation(async () => {
    return [[{ Name: 'Planner (Profile)', OCE__BusinessHours__c: 'MockedBusinessHours' }]];
  });
  fetchWorkingDaysConfig.mockImplementation(async () => {
    return [
      [
        { OCE__End2__c: 'FridayEndTime', OCE__Start2__c: 'FridayStartTime' },
        { OCE__End2__c: 'MondayEndTime', OCE__Start2__c: 'MondayStartTime' },
        { OCE__End2__c: 'SaturdayEndTime', OCE__Start2__c: 'SaturdayStartTime' },
        { OCE__End2__c: 'SundayEndTime', OCE__Start2__c: 'SundayStartTime' },
        { OCE__End2__c: 'ThursdayEndTime', OCE__Start2__c: 'ThursdayStartTime' },
        { OCE__End2__c: 'TuesdayEndTime', OCE__Start2__c: 'TuesdayStartTime' },
        { OCE__End2__c: 'WednesdayEndTime', OCE__Start2__c: 'WednesdayStartTime' },
      ],
    ];
  });
  fetchBusinessHours.mockImplementation(async () => {
    return [
      [
        {
          FridayEndTime: '19:00:00.000Z',
          FridayStartTime: '10:00:00.000Z',
          MondayEndTime: '19:00:00.000Z',
          MondayStartTime: '10:00:00.000Z',
          SaturdayEndTime: null,
          SaturdayStartTime: null,
          SundayEndTime: null,
          SundayStartTime: null,
          ThursdayEndTime: '19:00:00.000Z',
          ThursdayStartTime: '10:00:00.000Z',
          TuesdayEndTime: '19:00:00.000Z',
          TuesdayStartTime: '10:00:00.000Z',
          WednesdayEndTime: '19:00:00.000Z',
          WednesdayStartTime: '10:00:00.000Z',
        },
      ],
    ];
  });
  fetchHolidayDaysConfig.mockImplementation(async () => {
    return [[{ OCE__Priority2__c: 1, OCE__Start2__c: 'Date__c' }]];
  });
  fetchHolidays.mockImplementation(async () => {
    return [
      [
        { Id: 'a362C000002X4AgQAK', OCE__Date__c: '2024-03-18' },
        { Id: 'a362C000002X4AbQAK', OCE__Date__c: '2024-03-05' },
        { Id: 'a362C000002X4DrQAK', OCE__Date__c: '2024-03-12' },
      ],
    ];
  });
  fetchTimeOffDaysConfig.mockImplementation(async () => {
    return [
      [
        {
          OCE__End2__c: 'EndDate__c',
          OCE__Method2__c: 'SpanType__c',
          OCE__Priority2__c: null,
          OCE__Start2__c: 'StartDate__c',
          OCE__Type2__c: 'Type__c',
          OCE__Value2__c: 'TimeOff__c',
        },
      ],
    ];
  });
  fetchTOTSettings.mockImplementation(async () => {
    return [
      [
        {
          OCE__Working__c: 'Civil Activity',
        },
      ],
    ];
  });
  fetchTOTs.mockImplementation(async () => {
    return [
      [
        {
          Id: 'a5O2C000000dsTVUAY',
          OCE__EndDate__c: '2024-03-14T07:00:00.000+0000',
          OCE__SpanType__c: 'Days',
          OCE__StartDate__c: '2024-03-12T07:00:00.000+0000',
          OCE__TimeOff__c: '2',
          OCE__Type__c: 'Vacation',
        },
        {
          Id: 'a5O2C000000dsTaUAI',
          OCE__EndDate__c: '2024-03-21T01:00:00.000+0000',
          OCE__SpanType__c: 'Hours',
          OCE__StartDate__c: '2024-03-20T19:00:00.000+0000',
          OCE__TimeOff__c: '6',
          OCE__Type__c: 'Vacation',
        },
      ],
    ];
  });

  it('renders correctly', () => {
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    const main = getByTestId('main');

    expect(main).toBeTruthy();
    expect(findByText('March 1')).toBeTruthy();
    expect(findByText('March 31')).toBeTruthy();
  });
});
