import { Autocomplete, Button, Modal, Portal } from '@oce-apps/apollo-react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { isWeb } from '../utils';

export const ModalSelector = ({
  title,
  placeholder,
  visible,
  handleCancel,
  handleNext,
  items,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={styles.modal}
      >
        <Modal.Title title={title} closeIcon={false} />
        <Modal.Content>
          <Autocomplete
            placeholder={selectedItem ? '' : placeholder}
            source={items}
            onChange={(item) => setSelectedItem(item)}
            fullWidth
            singleSelect
          />
        </Modal.Content>
        <Modal.Actions style={styles.buttonsContainer}>
          <Button
            style={isWeb && styles.button}
            mode="outlined"
            color="tertiary"
            onPress={() => {
              setSelectedItem(null);
              handleCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            style={isWeb && styles.button}
            mode="contained"
            onPress={() => {
              setSelectedItem(null);
              handleNext(selectedItem);
            }}
          >
            Next
          </Button>
        </Modal.Actions>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '90%',
    minWidth: '90%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    cursor: 'pointer',
  },
});
