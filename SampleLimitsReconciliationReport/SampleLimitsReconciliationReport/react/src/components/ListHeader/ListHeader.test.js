import React from 'react';
import { render } from '@testing-library/react-native';
import { ListHeader } from "./ListHeader";

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}))

const testTitles = [
  'test 1',
  'test 2',
  'test 3',
];

describe('ListHeader', () => {
  it('should render ListHeader component', () => {

    const { getByText } = render(
      <ListHeader titles={testTitles} />
    );

    expect(getByText('test 1')).toBeTruthy();
  });
});
