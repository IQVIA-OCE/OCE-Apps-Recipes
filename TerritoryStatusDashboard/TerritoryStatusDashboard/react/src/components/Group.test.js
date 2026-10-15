import { render } from '@testing-library/react-native';
import { DarkTheme, Provider as ApolloProvider } from '@oce-apps/apollo-react-native';
import React from 'react';
import { SUBGROUPS_DATA } from '../mocks/territoryStatusTestData';
import { Group } from './Group';

describe('Group', () => {
  test('should render properly', () => {
    const { queryByText } = render(
      <Group title="Group title" subgroups={SUBGROUPS_DATA} />
    );

    expect(queryByText(/Group title/i)).toBeTruthy();
  });

  test('should render properly if there are no subgroups', () => {
    const { queryByText } = render(
      <Group title="Group title" />
    );

    expect(queryByText(/Group title/i)).toBeTruthy();
  });

  test('should render properly with DarkTheme', () => {
    const { queryByText } = render(
      <ApolloProvider theme={DarkTheme}>
        <Group title="Group title" />
      </ApolloProvider>
    );

    expect(queryByText(/Group title/i)).toBeTruthy();
  });
});
