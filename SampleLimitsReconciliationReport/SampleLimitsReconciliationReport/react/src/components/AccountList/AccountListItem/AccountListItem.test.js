import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AccountListItem } from "./AccountListItem";
import { testAccountItems } from "../../../utils/testData";
import { useDispatch } from 'react-redux';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

const dispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => fn()),
  getParam: jest
    .fn()
    .mockImplementation(() => false),
  navigate: jest.fn(),
};

describe('AccountListItem', () => {
  beforeEach(() => {
    useDispatch.mockImplementation(() => dispatch);
  });
  it('should render AccountListItem component ', () => {
    const { getByText } = render(
      <AccountListItem data={testAccountItems} navigation={navigation} />
    );

    const row = getByText('BRIAN PAT __OLOFSSON')
    expect(row).toBeTruthy();
    fireEvent.press(row);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });
});
