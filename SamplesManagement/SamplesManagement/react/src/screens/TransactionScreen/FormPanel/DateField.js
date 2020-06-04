import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';
import { TextInput, DateTimePicker } from 'apollo-react-native';
import { useBoolean } from '../../../hooks';

const DateField = ({ value, onChange, label, style, required, errors, touched, hasError, helperText }) => {
  const [isVisible, visibleActions] = useBoolean(false);
  const input = useRef();
  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={input}
        label={label}
        value={value ? moment(value).format('MMM DD, YYYY') : ''}
        icon="calendar-blank"
        iconColor="#000"
        onFocus={visibleActions.setTrue}
        onIconPress={visibleActions.setTrue}
        fullWidth
        required={required}
        error={hasError}
        helperText={helperText}
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
