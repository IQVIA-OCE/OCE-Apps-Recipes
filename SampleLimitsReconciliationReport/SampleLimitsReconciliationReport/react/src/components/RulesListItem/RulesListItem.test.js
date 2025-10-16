import React from 'react';
import { render } from '@testing-library/react-native';
import { testRulesItems } from "../../utils/testData";
import { RulesListItem } from "./RulesListItem";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}))

describe('RulesListItem', () => {
  it('should render RulesListItem component', () => {

    const { getByText } = render(
      <RulesListItem rules={testRulesItems} />
    );

    expect(getByText('Jul 1, 2018 - null')).toBeTruthy();
  });
});
