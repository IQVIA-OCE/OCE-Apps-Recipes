import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { openNativeViewScreen } from '../utils';
import { ActionCell } from './ActionCell';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../utils', () => ({
  openNativeViewScreen: jest.fn(),
}));

const ROW_PROP = {
  id: '111',
  sObject: 'TestSObject',
  testField: 'Some test text',
};

const COLUMN_PROP = {
  accessor: 'testField',
};

describe('ActionCell', () => {
  beforeEach(() => {
    openNativeViewScreen.mockReset();
  });

  test('should render properly', () => {
    const { getByText } = render(
      <View>
        <ActionCell row={ROW_PROP} column={COLUMN_PROP} />
      </View>
    );

    expect(getByText(/Some test text/i)).toBeTruthy();
  });

  test('should call openNativeViewScreen() utility if user press on text', () => {
    const { getByText } = render(
      <View>
        <ActionCell row={ROW_PROP} column={COLUMN_PROP} />
      </View>
    );

    expect(getByText(/Some test text/i)).toBeTruthy();

    fireEvent.press(getByText(/Some test text/i));

    expect(openNativeViewScreen).toHaveBeenCalled();
    expect(openNativeViewScreen).toHaveBeenCalledWith('TestSObject', '111');
  });
});
