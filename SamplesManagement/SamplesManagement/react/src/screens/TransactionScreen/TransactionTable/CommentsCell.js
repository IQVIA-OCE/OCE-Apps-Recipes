import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'apollo-react-native';
import { useField } from 'formik';

const CommentsCell = ({ form, row, readonly, ...rest }) => {
  const fieldIndex = form.values.products.findIndex(
    ({ lotNumberId, sampleProductId }) =>
      row.lotNumberId == lotNumberId && row.sampleProductId == sampleProductId
  );
  const [field, meta, helpers] = useField(`products[${fieldIndex}].comments`);
  return (
    <View style={styles.container}>
      <TextInput
        value={field.value}
        onChangeText={value => {
          helpers.setValue(value);
        }}
        multiline
        readonly={readonly}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  input: {
    width: 80,
  },
});

export default CommentsCell;
