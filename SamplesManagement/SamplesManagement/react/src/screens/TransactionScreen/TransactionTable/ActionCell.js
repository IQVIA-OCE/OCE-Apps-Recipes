import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'apollo-react-native';

const ActionCell = (props) => {
  const { row, onPress } = props;

  return (
    <View style={styles.container}>
      {row.locked ? (
        <IconButton icon="lock" style={styles.icon} size={23} disabled />
      ) : (
        <IconButton
          icon="delete"
          style={styles.icon}
          size={23}
          onPress={() => onPress(row)}
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
