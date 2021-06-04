import React from 'react';
import AppBar from './AppBar';
import renderer from 'react-test-renderer';
import * as constants from '../../constants';

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
  it('should render properly iPad version', () => {
    constants.isIphone = false;

    const props = createTestProps({});
    const tree = renderer.create(
      <AppBar {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
