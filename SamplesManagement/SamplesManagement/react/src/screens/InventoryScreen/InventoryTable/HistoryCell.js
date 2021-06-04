import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, secondaryBlue } from 'apollo-react-native';
import { useFormikContext } from 'formik';

const HistoryCell = ({ row, onPress }) => {
  const { values } = useFormikContext();
  const fieldIndex = values.products.findIndex(
    ({ lotNumberId }) => row.lotNumberId === lotNumberId
  );

  return (
    <View style={styles.container}>
        <IconButton
          icon="history"
          style={styles.icon}
          color={secondaryBlue[300]}
          size={23}
          onPress={() => onPress(row)}
        />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  icon: { alignContent: 'center', alignItems: 'center' },
});

export default HistoryCell;
