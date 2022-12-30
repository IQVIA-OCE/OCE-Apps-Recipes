import React from 'react';
import LineChartTRXDetails from './index';
import renderer, { act } from 'react-test-renderer';
import { sfNetAPI } from 'oce-apps-bridges';

describe('LineChartTRXDetails', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render properly', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <LineChartTRXDetails />
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchMarketsList', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <LineChartTRXDetails />
      );
    });

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((query, cb, err) => {
        cb({
          records: [{
            OCE__Market__c: 'TEST'
          }]
        })
      })

    const instance = tree.getInstance();

    try {
      await instance.fetchMarketsList();
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchMarketsList with recordId', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <LineChartTRXDetails recordId="123"/>
        );
    });

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((query, cb, err) => {
        cb({
          records: [{
            OCE__Market__c: 'TEST'
          }]
        })
      })

    const instance = tree.getInstance();

    try {
      await instance.fetchMarketsList();
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchMarketsList with no data', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <LineChartTRXDetails />
        );
    });

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((query, cb, err) => {
        cb({
          records: []
        })
      });

    const instance = tree.getInstance();

    try {
      await instance.fetchMarketsList();
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchMarketsList with error', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <LineChartTRXDetails />
        );
    });

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((query, cb, err) => {
        err({
          message: 'ERROR'
        })
      });

    const instance = tree.getInstance();

    try {
      await instance.fetchMarketsList();
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call handleMarketChange', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <LineChartTRXDetails />
        );
    });
    const instance = tree.getInstance();

    try {
      await instance.handleMarketChange();
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
