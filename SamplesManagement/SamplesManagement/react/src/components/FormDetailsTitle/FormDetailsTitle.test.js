import renderer from "react-test-renderer";
import FormDetailsTitle from "./FormDetailsTitle";
import {Text} from "react-native";
import React from "react";

describe('FormDetailsTitle', () => {
  it('Should render FormDetailsTitle ', () => {
    const tree = renderer
      .create(
        <FormDetailsTitle title="title">
          <Text>Text</Text>
        </FormDetailsTitle>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});