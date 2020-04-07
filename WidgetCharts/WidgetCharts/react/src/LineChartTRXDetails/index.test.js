import React from 'react';
import LineChartTRXDetails from './index';
import renderer from 'react-test-renderer';


describe('LineChartTRXDetails', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <LineChartTRXDetails />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
