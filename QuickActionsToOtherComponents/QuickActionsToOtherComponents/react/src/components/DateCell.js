import { Text } from '@oce-apps/apollo-react-native';
import { DateTime } from 'luxon';
import React from 'react';
import { View } from 'react-native';
import { DATE_TYPE, LOCALE } from '../constants';

export const DateCell = ({ row, column, ...props }) => {
  const modifiedLocale = LOCALE.replace('_', '-');
  const dateFormat =
    row.dateType === DATE_TYPE.DATETIME
      ? DateTime.DATETIME_MED
      : DateTime.DATE_MED;
  const formattedDate = row[column.accessor]
    ? DateTime.fromISO(row[column.accessor], { zone: 'utc' })
        .setLocale(modifiedLocale)
        .toLocaleString(dateFormat)
    : null;

  return (
    <View {...props}>
      <Text>{formattedDate}</Text>
    </View>
  );
};
