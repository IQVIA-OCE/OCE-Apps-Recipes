import React from 'react';
import renderer from 'react-test-renderer';
import DashboardScreen from './DashboardScreen';

const navigation = {
  addListener: jest.fn()
};
describe('DashboardScreen', () => {
  it('should render DashboardScreen component', () => {
    const tree = renderer.create(<DashboardScreen navigation={navigation} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
