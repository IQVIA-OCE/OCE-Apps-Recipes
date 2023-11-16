import { View, StyleSheet } from 'react-native';
import { RadioButton, Text } from 'apollo-react-native';

const RADIO_BUTTON_CELL_WIDTH = 35;

export const AccountItem = ({ item, selectedAccount, cellWidth, onPress }) => {
  return (
    <View style={styles.root}>
      <View style={{ width: RADIO_BUTTON_CELL_WIDTH }}>
        <RadioButton
          value={item.id}
          onChange={() => onPress(item)}
          status={item.id === selectedAccount?.value ? 'checked' : 'unchecked'}
        />
      </View>
      <View style={[styles.cell, { width: cellWidth }]}>
        <Text>{item.name}</Text>
      </View>
      <View style={[styles.cell, { width: cellWidth }]}>
        <Text>{item.kanaName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    height: 30,
  },
});
