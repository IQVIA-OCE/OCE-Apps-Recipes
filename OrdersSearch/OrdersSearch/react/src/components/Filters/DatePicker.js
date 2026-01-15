import React, { useRef } from "react";
import { View } from "react-native";
import { DateTimePicker, TextInput } from "@oce-apps/apollo-react-native";
import { formatDate } from "../../utils";

export const DatePicker = ({
  date = null,
  isVisible,
  setDatePickerVisibility,
  type,
  placeholder,
  done,
  maximumDate,
  minimumDate,
  testID = 'datepickerWrapper'
}) => {
  let input = useRef(null);

  return (
    <View testID={testID}>
      <TextInput
        ref={input}
        style={{ width: "100%" }}
        value={date ? formatDate(date) : ''}
        onFocus={() =>
          setDatePickerVisibility((prevState) => ({
            ...prevState,
            [`${type}Visibility`]: true,
          }))
        }
        onIconPress={() =>
          setDatePickerVisibility((prevState) => ({
            ...prevState,
            [`${type}Visibility`]: true,
          }))
        }
        icon="calendar-blank"
        numberOfLines={1}
        showSoftInputOnFocus={false}
        placeholder={placeholder}
        testID="datepickerInput"
      />

      <DateTimePicker
        style={{ flex: 1 }}
        visible={isVisible}
        anchor={input}
        date={date ? new Date(date) : new Date()}
        mode={"date"}
        onBackdropPress={() =>
          setDatePickerVisibility((prevState) => ({
            ...prevState,
            [`${type}Visibility`]: false,
          }))
        }
        actions={{
          done: {
            onPress: (_, value) => {
              done(new Date(value).toISOString());
              setDatePickerVisibility((prevState) => ({
                ...prevState,
                [`${type}Visibility`]: false,
              }));
            },
          },
        }}
        maximumDate={maximumDate ? new Date(maximumDate) : null}
        minimumDate={minimumDate ? new Date(minimumDate) : null}
        testID="datepicker"
      />
    </View>
  );
};

