import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'apollo-react-native';
import { useField } from 'formik';

const QuantityCell = ({ form, row, ...rest }) => {
  const fieldIndex = form.values.products.findIndex(({ Id }) => row.Id === Id);
  const [quantityField, quantityMeta, quantityHelpers] = useField(
    `products[${fieldIndex}].quantity`
  );
  return (
    <View style={styles.container}>
      <TextInput
        value={quantityField.value}
        onChangeText={value => {
          quantityHelpers.setValue(value);
        }}
        error={form.touched.products && form.touched.products.length && quantityMeta.error}
        helperText={form.touched.products && form.touched.products.length ? quantityMeta.error : null}
        keyboardType={'numeric'}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 5
  },
  input: {
    width: 80,
  },
});

export default QuantityCell;
