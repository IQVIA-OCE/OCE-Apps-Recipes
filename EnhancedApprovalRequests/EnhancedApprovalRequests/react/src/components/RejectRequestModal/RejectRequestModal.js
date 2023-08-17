import React, { useState } from 'react';
import { Button, Modal, TextInput } from 'apollo-react-native';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { loadingStatusSelector } from '../../store/approvalRequests/approvalRequestsSelectors';
import { LOADING_STATUS } from '../../constants';
import { isIphone } from '../../utils';
import { KeyboardAvoidingModal } from '../KeyboardAvoidingModal/KeyboardAvoidingModal';

export const RejectRequestModal = ({ isOpen, title, onReject, onSuccess, onClose }) => {
  const [comment, setComment] = useState('');
  const loadingStatus = useSelector(loadingStatusSelector);

  const isSubmitting = loadingStatus === LOADING_STATUS.SUBMITTING;

  const handleClose = () => {
    setComment('');
    onClose();
  };

  const handleReject = async () => {
    try {
      await onReject(comment);

      onSuccess();
      setComment('');
      onClose();
    } catch (e) {}
  };

  return (
    <KeyboardAvoidingModal visible={isOpen} onDismiss={onClose} additionalTopSpacing={50}>
      <Modal.Title title={title} closeIcon />
      <Modal.Content>
        <View style={[!isIphone && { width: 600 }]}>
          <TextInput
            label="Comments"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            autoCorrect={false}
            fullWidth
          />
        </View>
      </Modal.Content>
      <Modal.Actions>
        <Button mode="contained" color="tertiary" onPress={handleClose}>
          Cancel
        </Button>
        <Button loading={isSubmitting} mode="contained" disabled={isSubmitting} onPress={handleReject}>
          Reject
        </Button>
      </Modal.Actions>
    </KeyboardAvoidingModal>
  );
};
