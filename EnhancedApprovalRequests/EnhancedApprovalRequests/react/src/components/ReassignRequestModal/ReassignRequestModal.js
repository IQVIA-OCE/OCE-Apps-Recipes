import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, Modal } from '@oce-apps/apollo-react-native';
import { View } from 'react-native';
import { fetchAllUsers } from '../../api/approvalRequestsApi';
import { useSelector } from 'react-redux';
import { loadingStatusSelector } from '../../store/approvalRequests/approvalRequestsSelectors';
import { LOADING_STATUS } from '../../constants';
import { isMobilePhone } from '../../utils';
import { KeyboardAvoidingModal } from '../KeyboardAvoidingModal/KeyboardAvoidingModal';

const mapUser = u => ({ value: u.Id, label: u.Name });

const APPROXIMATE_AUTOCOMPLETE_MENU_HEIGHT = 280;

export const ReassignRequestModal = ({ isOpen, title, onReassign, onSuccess, onClose }) => {
  const [users, setUsers] = useState([]);
  const [nextApprover, setNextApprover] = useState(null);
  const loadingStatus = useSelector(loadingStatusSelector);

  const isSubmitting = loadingStatus === LOADING_STATUS.SUBMITTING;

  useEffect(() => {
    fetchAllUsers().then(([users]) => {
      setUsers(users.map(mapUser));
    });
  }, []);

  const handleClose = () => {
    setNextApprover(null);
    onClose();
  };

  const handleApprove = async () => {
    try {
      await onReassign(nextApprover.value);

      onSuccess();
      setNextApprover(null);
      onClose();
    } catch (e) {}
  };

  return (
    <KeyboardAvoidingModal
      visible={isOpen}
      onDismiss={handleClose}
      additionalTopSpacing={APPROXIMATE_AUTOCOMPLETE_MENU_HEIGHT}
    >
      <Modal.Title title={title} closeIcon />
      <Modal.Content>
        <View style={[!isMobilePhone && { width: 600 }]}>
          <Autocomplete
            label="Reassign To"
            placeholder="Search people..."
            source={users}
            singleSelectValue={nextApprover}
            onChange={setNextApprover}
            style={{ zIndex: 5 }}
            fullWidth
            singleSelect
            required
          />
        </View>
      </Modal.Content>
      <Modal.Actions>
        <Button mode="contained" color="tertiary" onPress={handleClose}>
          Cancel
        </Button>
        <Button
          loading={isSubmitting}
          mode="contained"
          disabled={isSubmitting || !nextApprover}
          onPress={handleApprove}
        >
          Reassign
        </Button>
      </Modal.Actions>
    </KeyboardAvoidingModal>
  );
};
