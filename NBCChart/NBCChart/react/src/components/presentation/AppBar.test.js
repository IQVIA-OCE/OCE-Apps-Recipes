import React from 'react';
import AppBar from './AppBar';
import renderer from 'react-test-renderer';

const createTestProps = (props) => ({
  navigation: {
    goBack: jest.fn(),
    isFirstRouteInParent: jest.fn()
  },
  navigationOptions: {
    title: 'Testing'
  },
  ...props
});

describe('AppBar', () => {
  it('should render properly', () => {
    const props = createTestProps({});
    const tree = renderer.create(
      <AppBar {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
