import React from 'react';
import renderer from 'react-test-renderer';
import AppBar from './AppBar';

describe('AppBar', () => {
  it('Should render AppBar component', () => {
    const tree = renderer
      .create(
        <AppBar navigation={{
          isFirstRouteInParent: () => {
          }
        }} navigationOptions={{ title: '' }}/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Should render AppBar component with isFirstRouteInParent', () => {
    const tree = renderer
      .create(
        <AppBar navigation={{
          isFirstRouteInParent: () => true
        }} navigationOptions={{ title: '' }}/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Should render AppBar component with actions', () => {
    const tree = renderer
      .create(
        <AppBar
          navigation={{
            isFirstRouteInParent: () => {
            }
          }}
          navigationOptions={{ title: 'Accounts' }}/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
