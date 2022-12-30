import { Appbar as ApolloAppBar } from 'apollo-react-native';
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
      );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render AppBar component with goBack action', () => {
    const tree = renderer
      .create(
        <AppBar
          navigation={{
            isFirstRouteInParent: () => {},
            goBack: () => {}
          }}
          navigationOptions={{ title: '' }}/>
      );

    tree.root.findByType(ApolloAppBar.Action).props.onPress();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render AppBar component with openVRform action', () => {
    const tree = renderer
      .create(
        <AppBar
          navigation={{
            isFirstRouteInParent: () => true,
            navigate: () => {},
          }}
          navigationOptions={{ title: 'Accounts' }}/>
      );

    tree.root.findByType(ApolloAppBar.Action).props.onPress();

    expect(tree.toJSON()).toMatchSnapshot();

  });
});