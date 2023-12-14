import FormDetailsTitle from "./FormDetailsTitle";
import { Text } from "react-native";
import React from "react";
import { render } from '@testing-library/react-native';

describe('FormDetailsTitle', () => {
  it('Should render FormDetailsTitle ', () => {
    const { getByText } = render(
      <FormDetailsTitle title="title">
        <Text>children</Text>
      </FormDetailsTitle>
    );

    expect(getByText(/title/)).toBeTruthy();
    expect(getByText(/children/)).toBeTruthy();
  });
});