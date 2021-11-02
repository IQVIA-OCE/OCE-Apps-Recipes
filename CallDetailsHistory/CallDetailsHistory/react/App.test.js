import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';
import { DateTime } from 'luxon';

const LOCAL_DATE_MOCK = {
  ts: 1609770654165,
  _zone: {},
  loc: {
    locale: 'en',
    numberingSystem: null,
    outputCalendar: null,
    intl: 'en',
    weekdaysCache: { format: {}, standalone: {} },
    monthsCache: { format: {}, standalone: {} },
    meridiemCache: null,
    eraCache: {},
    specifiedLocale: null,
    fastNumbersCached: null,
  },
  invalid: null,
  weekData: null,
  c: {
    year: 2021,
    month: 1,
    day: 4,
    hour: 16,
    minute: 30,
    second: 54,
    millisecond: 165,
  },
  o: 120,
  isLuxonDateTime: true,
};


describe('Application', () => {
  beforeAll(() => {
    DateTime.local = jest.fn().mockReturnValue(LOCAL_DATE_MOCK);
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useFakeTimers();
  });

  it('should render properly', () => {
    const tree = renderer.create(<App />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render App with instanceId', () => {
    const tree = renderer.create(<App instanceId="1-5-6" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
