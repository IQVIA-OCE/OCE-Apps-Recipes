import * as yup from 'yup';
import { Button, Modal } from '@oce-apps/apollo-react-native';
import { Formik } from 'formik';
import { CallToDoForm } from '../CallToDoForm/CallToDoForm';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callSelector, formLoadingStatusSelector } from '../../store/callToDos/callToDosSelectors';
import { saveToDo } from '../../store/callToDos/callToDosSlice';
import { LOADING_STATUS } from '../../constants';
import { KeyboardAvoidingModal } from '../KeyboardAvoidingModal/KeyboardAvoidingModal';
import { Platform, ScrollView, View } from 'react-native';

const validationSchema = yup.object().shape({
  complianceType: yup.string().nullable(),
  compliance: yup
    .object({
      label: yup.string(),
      value: yup.string(),
    })
    .required('Field is required'),
  surveyType: yup
    .object({
      label: yup.string(),
      value: yup.string(),
    })
    .required('Field is required'),
  interviewee: yup
    .object({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable(),
  otherInterviewee: yup.string().nullable(),
});

export const CallToDoModal = ({ existingRecord, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const formikRef = useRef();
  const call = useSelector(callSelector);
  const formLoadingStatus = useSelector(formLoadingStatusSelector);

  const isSubmitting = formLoadingStatus === LOADING_STATUS.SUBMITTING;
  const isEdit = Boolean(existingRecord);

  const handleSubmit = async (values) => {
    await dispatch(
      saveToDo({
        id: existingRecord?.id ?? null,
        callId: call.id,
        complianceType: values.complianceType,
        compliance: values.compliance?.value,
        surveyType: values.surveyType?.value,
        interviewee: values.interviewee?.value ?? null,
        otherInterviewee: values.otherInterviewee,
      })
    ).unwrap();

    onClose();
  };

  const FormWrapper = Platform.OS === 'web' ? ScrollView : View;

  const initialValues = {
    complianceType: existingRecord?.complianceType ?? null,
    compliance: existingRecord ? { label: existingRecord.complianceName, value: existingRecord.complianceId } : null,
    surveyType: null,
    interviewee: Boolean(existingRecord?.intervieweeName && existingRecord?.intervieweeId)
      ? { label: existingRecord.intervieweeName, value: existingRecord.intervieweeId }
      : null,
    otherInterviewee: existingRecord?.otherIntervieweeName ?? '',
  };

  return (
    <KeyboardAvoidingModal visible={isOpen} onDismiss={onClose} additionalTopSpacing={200}>
      <Modal.Title title={`${isEdit ? 'Edit' : 'New'} EPPV/MID`} closeIcon />
      <Modal.Content>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          innerRef={formikRef}
        >
          <FormWrapper>
            <CallToDoForm isEdit={isEdit} initialSurveyType={existingRecord?.surveyType} />
          </FormWrapper>
        </Formik>
      </Modal.Content>
      <Modal.Actions>
        <Button mode="contained" color="tertiary" onPress={onClose}>
          Cancel
        </Button>
        <Button
          loading={isSubmitting}
          mode="contained"
          disabled={isSubmitting}
          onPress={() => formikRef.current.handleSubmit()}
        >
          Save
        </Button>
      </Modal.Actions>
    </KeyboardAvoidingModal>
  );
};
