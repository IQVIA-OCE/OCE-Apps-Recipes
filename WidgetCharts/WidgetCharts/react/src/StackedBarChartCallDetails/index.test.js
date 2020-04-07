import React from 'react';
import StackedBarChartCallDetails from './index';
import renderer from 'react-test-renderer';


describe('LineChartTRXDetails', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <StackedBarChartCallDetails />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
