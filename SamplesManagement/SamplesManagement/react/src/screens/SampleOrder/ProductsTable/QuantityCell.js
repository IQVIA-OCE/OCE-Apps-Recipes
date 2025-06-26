import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from '@oce-apps/apollo-react-native';
import { useField } from 'formik';

const QuantityCell = ({ form, row, readonly, ...rest }) => {
  const fieldIndex = form.values.products.findIndex(
    ({ sampleProductId, id }) =>
      row.sampleProductId === sampleProductId && row.id === id
  );
  const [quantityField, quantityMeta, quantityHelpers] = useField(
    `products[${fieldIndex}].quantity`
  );

  const strValue = quantityField.value ? String(quantityField.value) : '';

  return (
    <View style={styles.container}>
      <TextInput
        value={strValue}
        onChangeText={value => {
          quantityHelpers.setValue(value);
        }}
        error={
          form.touched.products &&
          form.touched.products.length &&
          quantityMeta.error
        }
        helperText={
          form.touched.products && form.touched.products.length
            ? quantityMeta.error
            : null
        }
        keyboardType={'numeric'}
        readonly={readonly}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 5,
  },
  input: {
    width: 80,
  },
});

export default QuantityCell;
