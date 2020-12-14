import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useField } from 'formik';
import { TextInput, Select } from 'apollo-react-native';

const ReasonCell = ({ form, row, readonly, ...rest }) => {
  const fieldIndex = form.values.products.findIndex(
    ({ lotNumberId, sampleProductId }) =>
      row.lotNumberId == lotNumberId && row.sampleProductId == sampleProductId
  );
  const [reasonField, reasonMeta, reasonHelpers] = useField(
    `products[${fieldIndex}].reason`
  );

  return (
    <View style={styles.container}>
      {readonly ? (
        <TextInput
          style={styles.readonlyField}
          value={reasonField.value.label}
          fullWidth
          readonly
        />
      ) : (
        <Select
          options={[
            { label: 'Theft/Loss', id: 'Theft/Loss' },
            { label: 'Incorrect Disbursement', id: 'Incorrect Disbursement' },
            { label: 'Other', id: 'Other' },
          ]}
          placeholder={'-None-'}
          value={reasonField.value}
          onChange={value => {
            reasonHelpers.setValue(value);
          }}
          style={{ width: '100%' }}
          fullWidth
          hideDropdownPlaceholder
          error={
            form.touched.products &&
            form.touched.products.length &&
            reasonMeta.error
          }
          helperText={
            form.touched.products && form.touched.products.length
              ? reasonMeta.error
              : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: 80,
  },
});

export default ReasonCell;
