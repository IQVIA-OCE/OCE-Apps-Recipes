import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'apollo-react-native';
import { useField, useFormikContext } from 'formik';
import { INVENTORY_STATUS } from '../constants';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { InventoryContext } from '../InventoryContext';

const CountCell = ({ row }) => {
  const { values } = useFormikContext();
  const { editingType } = useContext(InventoryContext);
  const fieldIndex = values.products.findIndex(
    ({ lotNumberId }) => row.lotNumberId === lotNumberId
  );
  const [field, { touched, error }, helper] = useField(
    `products.${fieldIndex}`
  );

  return (
    <TextInput
      style={styles.input}
      value={field && field.value && field.value.physicalQuantity}
      onChangeText={physicalQuantity =>
        helper.setValue({ ...field.value, physicalQuantity })
      }
      error={
        touched && error && error.physicalQuantity
          ? error.physicalQuantity
          : null
      }
      readonly={
        editingType === INVENTORY_FORM_TYPE.preview ||
        editingType === INVENTORY_FORM_TYPE.editSaved
      }
    />
  );
};
const styles = StyleSheet.create({
  input: {
    width: 80,
  },
});

export default CountCell;
