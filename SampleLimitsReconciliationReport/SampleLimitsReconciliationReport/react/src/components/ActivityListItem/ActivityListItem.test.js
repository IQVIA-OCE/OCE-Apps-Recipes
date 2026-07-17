import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityListItem } from "./ActivityListItem";
import { testActivityItems } from "../../utils/testData";

describe('ActivityListItem', () => {
  it('should render ActivityListItem component', () => {

    const { getByText } = render(
      <ActivityListItem data={testActivityItems} />
    );

    expect(getByText('C-00000010')).toBeTruthy();
  });
});
