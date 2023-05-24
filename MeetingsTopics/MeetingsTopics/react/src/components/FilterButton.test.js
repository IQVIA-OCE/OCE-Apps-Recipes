import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterButton } from './FilterButton';
import { View } from 'react-native';
import * as commonUtils from '../utils/common';

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children }) => children)
);
describe('FilterButton', () => {
  it('should call onSetFilter prop on press', () => {
    const onSetFilter = jest.fn();

    const { getByText } = render(
      <View>
        <FilterButton onSetFilter={onSetFilter}>
          System Generated Filter
        </FilterButton>
      </View>
    );

    fireEvent.press(getByText(/System Generated Filter/i));
    expect(onSetFilter).toHaveBeenCalledTimes(1);
  });

  it('should render on IPad', () => {
    commonUtils.isIphone = false;
    const onSetFilter = jest.fn();

    const { getByText } = render(
      <View>
        <FilterButton onSetFilter={onSetFilter}>
          System Generated Filter
        </FilterButton>
      </View>
    );

    const filterButton = getByText(/System Generated Filter/i);
    expect(filterButton.props.style[1][3].fontSize).toEqual(18);
  });
});
