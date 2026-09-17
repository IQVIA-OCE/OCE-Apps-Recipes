import React from 'react';
import { render } from '@testing-library/react-native';
import { SelectButton } from './SelectButton';
import * as commonUtils from '../utils/common';

describe('AddButton', () => {
  it('should render on IPad', () => {
    commonUtils.isIphone = false;
    const handleSelect = jest.fn();

    const { getByText } = render(
      <SelectButton
        handleSelect={handleSelect}
        buttonText={'Selected'}
        mobileButtonColor={'green'}
        buttonColor={'tertiary'}
        icon={'check'}
      />
    );

    expect(getByText).toBeTruthy();
  });

  it('should render on IPhone', () => {
    commonUtils.isIphone = true;
    const handleSelect = jest.fn();

    const { getByLabelText } = render(
      <SelectButton
        handleSelect={handleSelect}
        buttonText={'Selected'}
        mobileButtonColor={'green'}
        buttonColor={'tertiary'}
        icon={'check'}
      />
    );

    expect(getByLabelText).toBeTruthy();
  });
});
