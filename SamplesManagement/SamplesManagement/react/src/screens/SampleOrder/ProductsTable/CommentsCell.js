import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'apollo-react-native';
import { useField } from 'formik';

const CommentsCell = ({ form, row, ...rest }) => {
  const fieldIndex = form.values.products.findIndex(({ Id }) => row.Id === Id);
  const [field, meta, helpers] = useField(
    `products[${fieldIndex}].comments`
  );
  return (
    <View style={styles.container}>
      <TextInput
        value={field.value}
        onChangeText={value => {
          helpers.setValue(value);
        }}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  input: {
    width: 80,
  },
});

export default CommentsCell;
