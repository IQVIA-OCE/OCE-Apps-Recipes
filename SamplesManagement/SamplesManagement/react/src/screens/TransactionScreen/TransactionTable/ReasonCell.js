import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useField } from 'formik';
import { TextInput, Select } from 'apollo-react-native';


const ReasonCell = ({ form, row, ...rest }) => {
  const fieldIndex = form.values.products.findIndex(({ Id }) => row.Id === Id);
  const [reasonField, reasonMeta, reasonHelpers] = useField(
    `products[${fieldIndex}].reason`
  );
  return (
    <View style={styles.container}>
      <Select
        options={[
          { label: 'Theft/Loss', id: '1' },
          { label: 'Incorrect Disbursement', id: '2' },
          { label: 'Other', id: '3' },
        ]}
        placeholder={'-None-'}
        value={reasonField.value}
        onChange={value => {
          reasonHelpers.setValue(value);
        }}
        style={{ width: '100%' }}
        fullWidth
        hideDropdownPlaceholder
        error={form.touched.products && form.touched.products.length && reasonMeta.error}
        helperText={form.touched.products && form.touched.products.length ? reasonMeta.error : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  input: {
    width: 80,
  },
});

export default ReasonCell;
