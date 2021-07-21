import React from 'react';
import renderer from 'react-test-renderer';
import ListHeader from './ListHeader';
import {IconButton} from "apollo-react-native";

describe('ListHeader', () => {
  it('Should render ListHeader component', () => {
    const tree = renderer.create(<ListHeader />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
