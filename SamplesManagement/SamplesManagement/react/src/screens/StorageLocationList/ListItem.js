import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioButton, Colors, IconButton } from 'apollo-react-native';

const ListItem = ({ item, handleChange, handleDelete, handleEdit }) => {
  const { address, isDefault, id } = item;
  return (
    <View style={styles.root}>
      <View style={styles.col}>
        <Text>{address}</Text>
      </View>
      <View style={[styles.col, styles.actionCol]}>
        <RadioButton
          value={id}
          status={isDefault ? 'checked' : 'unchecked'}
          onPress={() => !isDefault && handleChange(id)}
        />
        <View style={styles.actions}>
          <IconButton
            icon="delete"
            color={Colors.secondaryRed[400]}
            onPress={() => handleDelete(id)}
          />
          <IconButton
            icon="pencil"
            color={Colors.themePrimary[500]}
            onPress={() => handleEdit(id)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: Colors.themeGrey[200],
    alignItems: 'center',
  },
  col: {
    flex: 1,
  },
  actionCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: { flexDirection: 'row' },
});

export default ListItem;
