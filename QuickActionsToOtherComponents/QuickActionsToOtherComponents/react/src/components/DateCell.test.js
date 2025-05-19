import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { DATE_TYPE } from '../constants';
import { DateCell } from './DateCell';

const ROW_PROP = {
  testField: '2023-01-11T12:55:54.000Z',
};

const COLUMN_PROP = {
  accessor: 'testField',
};

describe('DateCell', () => {
  test('should render properly with full date and time format', () => {
    const { getByText } = render(
      <View>
        <DateCell
          testID="testDataCell"
          row={{ ...ROW_PROP, dateType: DATE_TYPE.DATETIME }}
          column={COLUMN_PROP}
        />
      </View>
    );

    expect(getByText(/Jan 11, 2023, 12:55 PM/i)).toBeTruthy();
  });

  test('should render properly with short date format', () => {
    const { getByText } = render(
      <View>
        <DateCell
          testID="testDataCell"
          row={{ ...ROW_PROP, dateType: DATE_TYPE.DATE }}
          column={COLUMN_PROP}
        />
      </View>
    );

    expect(getByText(/Jan 11, 2023/i)).toBeTruthy();
  });

  test('should render empty date if passed date is undefined', () => {
    const { getByText } = render(
      <View>
        <DateCell
          testID="testDataCell"
          row={{ dateType: DATE_TYPE.DATE }}
          column={COLUMN_PROP}
        />
      </View>
    );

    expect(getByText('')).toBeTruthy();
  });
});
