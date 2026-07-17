import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from '@oce-apps/apollo-react-native';
import { useField, useFormikContext } from 'formik';
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
    <View style={styles.root} testID="CountCell">
      <TextInput
        style={styles.input}
        value={
          field &&
          field.value &&
          !isNaN(parseFloat(field.value.physicalQuantity)) &&
          field.value.physicalQuantity.toString() ? field.value.physicalQuantity : null
        }
        onChangeText={physicalQuantity =>
          helper.setValue({
            ...field.value,
            physicalQuantity: physicalQuantity ? physicalQuantity : null,
          })
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
        helperText={
          touched && error && error.physicalQuantity
            ? error.physicalQuantity
            : null
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    paddingVertical: 5,
  },
  input: {
    width: 80,
  },
});

export default CountCell;
