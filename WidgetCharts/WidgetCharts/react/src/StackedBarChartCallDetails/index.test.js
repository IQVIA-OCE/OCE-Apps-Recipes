import React from 'react';
import StackedBarChartCallDetails from './index';
import renderer, { act } from 'react-test-renderer';
import { sfNetAPI } from 'oce-apps-bridges';
import moment from 'moment';

jest.mock('moment', () => () => ({
  format: () => "2001-05-01T00:00:00.000",
  subtract: () => "2001-05-01T00:00:00.000",
  add: jest.fn().mockReturnThis(),
  isValid: jest.fn().mockReturnValue(true)
}));

describe('StackedBarChartCallDetails', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((query, cb) => {
        cb({
          records: [{
            OCE__CallDateTime__c: 'Tue May 1 2020 16:31:00 GMT+0300 (Eastern European Summer Time)'
          }]
        })
      })
      .mockImplementationOnce((query, cb, err) => {
        err({
          message: 'ERROR'
        })
      })
      .mockImplementationOnce((query, cb) => {
        cb({
          records: []
        })
      })
      .mockImplementationOnce((query, cb) => {
        cb({
          records: [{
            OCE__CallDateTime__c: 'Tue May 1 2020 16:31:00 GMT+0300 (Eastern European Summer Time)'
          }]
        })
      })
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render properly', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <StackedBarChartCallDetails />
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();

  });


  it('should render with fetchDataError', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <StackedBarChartCallDetails />
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render with no data', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <StackedBarChartCallDetails />
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
