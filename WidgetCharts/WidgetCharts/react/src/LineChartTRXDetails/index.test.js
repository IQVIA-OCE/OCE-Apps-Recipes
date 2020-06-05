import React from 'react';
import LineChartTRXDetails from './index';
import renderer from 'react-test-renderer';
import { sfNetAPI } from '../../bridge/sf/sfnetapi';

describe('LineChartTRXDetails', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <LineChartTRXDetails />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchMarketsList', async () => {
    const tree = renderer.create(
      <LineChartTRXDetails />
    );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((query, cb, err) => {
        cb({
          records: [{
            OCE__Market__c: 'TEST'
          }]
        })
      })

    const instance = tree.getInstance();

    await instance.fetchMarketsList();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchMarketsList with no data', async () => {
    const tree = renderer.create(
      <LineChartTRXDetails />
    );

    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((query, cb, err) => {
        cb({
          records: []
        })
      });

    const instance = tree.getInstance();

    await instance.fetchMarketsList();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call fetchMarketsList with error', async () => {
    const tree = renderer.create(
      <LineChartTRXDetails />
    );

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
});
