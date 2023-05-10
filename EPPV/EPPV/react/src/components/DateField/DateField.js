import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { DateTime } from 'luxon';
import { TextInput, DateTimePicker, useTheme } from 'apollo-react-native';

export const DateField = ({ value, onChange, label, hasError, helperText, disabled }) => {
  const [isVisibleDatePicker, setVisibleDatePicker] = useState(false);
  const dateInput = useRef();
  const theme = useTheme();

  const formatDate = (date) => {
    return DateTime.fromISO(date)
      .toLocaleString(DateTime.DATE_SHORT)
      .replace(/\./g, '/');
  };

  return (
    <View>
      <TextInput
        ref={dateInput}
        label={label}
        value={value ? formatDate(value) : ''}
        icon={'calendar-blank'}
        iconColor={theme.colors.text}
        onFocus={() => setVisibleDatePicker(true)}
        onIconPress={() => setVisibleDatePicker(true)}
        fullWidth
        required
        asteriskPosition={'after'}
        error={hasError}
        helperText={helperText}
        disabled={disabled}
        testID={'datePickerInput'}
      />
      <DateTimePicker
        visible={isVisibleDatePicker}
        anchor={dateInput}
        date={value ? new Date(value) : new Date()}
        mode={'datetime'}
        onBackdropPress={() => setVisibleDatePicker(false)}
        actions={{
          done: {
            onPress: (_, d) => {
              onChange(d.toISOString());
              setVisibleDatePicker(false);
            },
          },
        }}
        testID={'datePicker'}
      />
    </View>
  );
};
