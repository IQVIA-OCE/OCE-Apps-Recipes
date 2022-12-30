import React from 'react';
import renderer, { act } from 'react-test-renderer';
import DashboardScreen from './DashboardScreen';

jest.useFakeTimers();

const navigation = {
  addListener: jest.fn()
};
describe('DashboardScreen', () => {
  it('should render DashboardScreen component', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(<DashboardScreen navigation={navigation} />);

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
