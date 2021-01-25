import React from 'react';
import StackedBarChartCallDetails from './index';
import renderer, { act } from 'react-test-renderer';
import { sfNetAPI } from '../../bridge/sf/sfnetapi';
import { Button } from 'apollo-react-native';
import moment from 'moment';

jest.mock('moment');


describe('LineChartTRXDetails', () => {
  beforeAll(() => {


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
  });

  it('should render properly', async () => {
    let tree;

    await act(() => {
      tree = renderer.create(
        <StackedBarChartCallDetails />
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();

  });


  it('should render with fetchDataError', () => {
    const tree = renderer.create(
      <StackedBarChartCallDetails />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render with no data', () => {
    const tree = renderer.create(
      <StackedBarChartCallDetails />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
