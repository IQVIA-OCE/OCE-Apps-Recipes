import React, { useContext, useEffect } from 'react';
import { Select, Text } from 'apollo-react-native';
import { useField, useFormikContext } from 'formik';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_STATUS, REASON_LIST } from '../constants';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { StyleSheet, View } from 'react-native';

const ReasonCell = ({ row }) => {
  const { values } = useFormikContext();
  const {
    editingType,
    config: { showCalculatedFields, showSystemCount },
  } = useContext(InventoryContext);

  const fieldIndex = values.products.findIndex(
    ({ lotNumberId }) => row.lotNumberId === lotNumberId
  );
  const [field, { touched, error }, helper] = useField(
    `products[${fieldIndex}]`
  );

  useEffect(() => {
    if (editingType !== INVENTORY_FORM_TYPE.preview) {
      if (parseInt(row.physicalQuantity) === parseInt(row.systemCount)) {
        helper.setValue({
          ...field.value,
          discrepancyReason: '',
          reasonObj: null,
        });
      }
      if (field.value.discrepancyReason && !field.value.reasonObj) {
        helper.setValue({
          ...field.value,
          reasonObj: REASON_LIST.find(
            el => el.id === field.value.discrepancyReason
          ),
        });
      }
    }
  }, [row.physicalQuantity]);

  // custom logic on specific configuration
  if (
    editingType === INVENTORY_FORM_TYPE.edit &&
    showCalculatedFields &&
    !showSystemCount &&
    values.status !== INVENTORY_STATUS.saved
  ) {
    return null;
  }

  if (
    (editingType === INVENTORY_FORM_TYPE.edit ||
      editingType === INVENTORY_FORM_TYPE.editSaved) &&
    !row.selected &&
    parseInt(row.physicalQuantity) === parseInt(row.systemCount)
  ) {
    return null;
  }

  if (editingType === INVENTORY_FORM_TYPE.preview) {
    return <Text>{field.value.discrepancyReason}</Text>;
  }

  return (
    <View style={styles.root}>
      <Select
        options={REASON_LIST}
        placeholder={'-None-'}
        value={field.value.reasonObj}
        onChange={value => {
          helper.setValue({
            ...field.value,
            discrepancyReason: value ? value.id : '',
            reasonObj: value,
          });
        }}
        fullWidth
        error={
          touched && error && error.discrepancyReason
            ? error.discrepancyReason
            : null
        }
        helperText={
          touched && error && error.discrepancyReason
            ? error.discrepancyReason
            : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 5,
    width: '100%',
  },
});

export default ReasonCell;
