import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'apollo-react-native';
import { useFormikContext } from 'formik';

const ActionCell = ({ row, onPress }) => {
  const { values } = useFormikContext();
  const fieldIndex = values.products.findIndex(
    ({ lotNumberId }) => row.lotNumberId === lotNumberId
  );

  return (
    <View style={styles.container}>
      {row.locked ? (
        <IconButton icon="lock" style={styles.icon} size={23} disabled />
      ) : (
        <IconButton
          icon="delete"
          style={styles.icon}
          size={23}
          onPress={() => onPress(fieldIndex)}
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
