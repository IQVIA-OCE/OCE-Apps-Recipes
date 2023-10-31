import { act, fireEvent, render } from '@testing-library/react-native';
import { DarkTheme, Provider as ApolloProvider, Tooltip } from 'apollo-react-native';
import React from 'react';
import { SUBGROUPS_DATA } from '../mocks/territoryStatusTestData';
import { GroupItem } from './GroupItem';
import { NumberWithTrend } from './NumberWithTrend';

const ITEM = SUBGROUPS_DATA[0].items[1];

describe('GroupItem', () => {
  test('should render properly', () => {
    const { queryByText } = render(
      <GroupItem item={ITEM} />
    );

    expect(queryByText(ITEM.name)).toBeTruthy();
  });

  test('should set correct Tooltip variant with DarkTheme', () => {
    const { UNSAFE_queryByType } = render(
      <ApolloProvider theme={DarkTheme}>
        <GroupItem item={ITEM} />
      </ApolloProvider>
    );

    expect(UNSAFE_queryByType(Tooltip).props.variant).toBe('dark');
  });

  test('should render number without symbol if it is undefined', () => {
    const { UNSAFE_queryByType } = render(
      <GroupItem item={{ ...ITEM, symbolAfter: undefined }} />
    );

    expect(UNSAFE_queryByType(NumberWithTrend).props.number).toBe(ITEM.amount.toString());
  });

  test('should change width of Text component with item.name', () => {
    const { queryByText, queryByTestId, UNSAFE_queryByType } = render(
      <GroupItem item={ITEM} testID="row-view" />
    );

    act(() => {
      fireEvent(
        queryByTestId('row-view'),
        'layout',
        { nativeEvent: { layout: { width: 350 } }, persist: () => {} },
      );
      fireEvent(
        UNSAFE_queryByType(NumberWithTrend),
        'layout',
        { nativeEvent: { layout: { width: 60 } }, persist: () => {} },
      );

    });

    expect(queryByText(ITEM.name)).toBeTruthy();
    expect(queryByText(ITEM.name).props.style[1].width).toBe(350 - 60 - 40 - 5);
  });
});
