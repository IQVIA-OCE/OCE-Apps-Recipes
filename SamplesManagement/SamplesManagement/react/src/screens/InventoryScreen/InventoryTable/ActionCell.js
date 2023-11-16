import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'apollo-react-native';
import { useFormikContext } from 'formik';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { InventoryContext } from '../InventoryContext';

const ActionCell = ({ row, onPress }) => {
  const theme = useTheme();
  const { values } = useFormikContext();
  const fieldIndex = values.products.findIndex(
    ({ lotNumberId }) => row.lotNumberId === lotNumberId
  );

  const { editingType } = useContext(InventoryContext);

  return (
    <View style={styles.container}>
      {row.locked ||
      editingType === INVENTORY_FORM_TYPE.preview ||
      editingType === INVENTORY_FORM_TYPE.editSaved ? (
        <IconButton
          icon="lock"
          style={styles.icon}
          color={theme.colors.tertiary}
          size={23}
          disabled
        />
      ) : (
        <IconButton
          icon="delete"
          style={styles.icon}
          size={23}
          color={theme.colors.tertiary}
          onPress={() => onPress(row, fieldIndex)}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  icon: { alignContent: 'center', alignItems: 'center' },
});

export default ActionCell;
