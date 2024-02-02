import React from 'react';
import { Portal, Modal, Button, TextInput, Text } from '@oce-apps/apollo-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getFieldError, getFieldHelperText } from './utils';

const DuplicateModal = ({ status, handleAction, onDismiss }) => {
  return (
    <Portal>
      <Modal visible={status} onDismiss={onDismiss}>
        <Formik
          enableReinitialize
          initialValues={{ fields: { comments: '' } }}
          onSubmit={handleAction}
          validateOnMount={true}
          validationSchema={Yup.object().shape({
            fields: Yup.object().shape({
              comments: Yup.string()
                .nullable()
                .required('Complete this field.'),
            }),
          })}
        >
          {({
            handleSubmit,
            values,
            touched,
            errors,
            handleChange,
          }) => (
            <>
              <Modal.Title title={`Duplicate`} closeIcon handleClose={onDismiss}/>
              <Modal.Content>
                <Text style={{ marginBottom: 20 }}>
                  Are you sure you want to mark this as a duplicate?
                </Text>
                <TextInput
                  value={values.fields.comments}
                  label={'Comments'}
                  onChangeText={handleChange('fields.comments')}
                  placeholder="Comments"
                  multiline
                  required
                  fullWidth
                  helperText={getFieldHelperText(
                    'comments',
                    errors,
                    touched
                  )}
                  error={getFieldError('comments', errors, touched)}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button mode="tertiary" onPress={onDismiss}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={() => handleSubmit()}>
                  Duplicate
                </Button>
              </Modal.Actions>
            </>
          )}
        </Formik>
      </Modal>
    </Portal>
  );
};

export default DuplicateModal;
