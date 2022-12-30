import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import { TextInput, DateTimePicker, useTheme } from 'apollo-react-native';
import { useBoolean } from '../../../hooks';

const DateField = ({ value, onChange, label, style, required, errors, touched, hasError, helperText, readonly }) => {
  const [isVisible, visibleActions] = useBoolean(false);
  const input = useRef();
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={input}
        label={label}
        value={value ? moment(value).format('MMM DD, YYYY') : ''}
        icon={!readonly ? "calendar-blank" : null}
        iconColor={theme.colors.text}
        onFocus={!readonly ? visibleActions.setTrue : null}
        onIconPress={!readonly ? visibleActions.setTrue : null}
        fullWidth
        required={required}
        error={hasError}
        helperText={helperText}
        readonly={readonly}
      />
      <DateTimePicker
        visible={isVisible}
        anchor={input}
        date={new Date()}
        mode={'date'}
        onBackdropPress={visibleActions.setFalse}
        actions={{
          done: {
            onPress: (_, d) => {
              onChange(d);
              visibleActions.setFalse();
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default DateField;
