import { View, StyleSheet } from 'react-native';
import { RadioButton, Select, TextInput } from 'apollo-react-native';
import { IntervieweeLookupField } from '../IntervieweeLookupField/IntervieweeLookupField';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { fetchAllComplianceRecords } from '../../api/callToDoApi';
import { useDispatch, useSelector } from 'react-redux';
import { callSelector, complianceTypesSelector } from '../../store/callToDos/callToDosSelectors';
import { SurveyTypeSelect } from '../SurveyTypeSelect/SurveyTypeSelect';
import { showErrorNotification } from '../../store/notification/notificationSlice';
import { usePrevious } from '../../hooks';

export const CallToDoForm = ({ isEdit, initialSurveyType }) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext();
  const complianceTypes = useSelector(complianceTypesSelector);
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [complianceRecordsLoading, setComplianceRecordsLoading] = useState(false);

  const call = useSelector(callSelector);
  const dispatch = useDispatch();
  const isCallAccountHCOOrPharmacy = !(
    call.account?.isPersonAccount || call.account?.recordType?.developerName === 'Ins_Doc'
  );

  const prevComplianceType = usePrevious(values.complianceType);

  useEffect(() => {
    if (values.complianceType === null) {
      const eppvPicklistValue = complianceTypes.find((pVal) => pVal.value === 'EPPV');

      if (eppvPicklistValue) setFieldValue('complianceType', eppvPicklistValue.value);
    }
  }, [values.complianceType, complianceTypes]);

  useEffect(() => {
    if (values.complianceType !== null) {
      getComplianceRecords(values.complianceType);

      if (touched.complianceType && values.complianceType !== prevComplianceType) {
        setFieldValue('compliance', null);
      }
    }
  }, [values.complianceType, prevComplianceType, touched.complianceType]);

  const getComplianceRecords = async (complianceType) => {
    try {
      setComplianceRecordsLoading(true);

      const records = await fetchAllComplianceRecords({
        callDateTime: call.callDateTime,
        complianceType,
      });
      setComplianceRecords(records.map((r) => ({ label: r.Name, value: r.Id })));
    } catch (error) {
      console.log(error);
      dispatch(showErrorNotification(error));
    } finally {
      setComplianceRecordsLoading(false);
    }
  };

  const handleError = (error) => {
    dispatch(showErrorNotification(error));
  };

  return (
    <View style={styles.modalContentContainer} testID="callToDoFormWrapper">
      <View style={styles.fieldContainer} testID="complianceTypeFieldContainer">
        <RadioButton.Group
          label="Type"
          asteriskPosition="after"
          required
          row
          onChange={(v) => {
            if (!touched.complianceType) {
              setFieldTouched('complianceType', true);
            }

            setFieldValue('complianceType', v);
          }}
          value={values.complianceType}
          disabled={isEdit}
        >
          {complianceTypes.map((type) => (
            <RadioButton key={type.value} label={`Compliance ${type.label}`} value={type.value} />
          ))}
        </RadioButton.Group>
      </View>

      <View style={styles.fieldContainer} testID="complianceFieldContainer">
        <Select
          fullWidth
          label="Compliance"
          required
          options={complianceRecords}
          onChange={(val) => {
            if (!touched.compliance) {
              setFieldTouched('compliance', true);
            }

            setFieldValue('compliance', val);
          }}
          value={values.compliance}
          error={touched.compliance && errors.compliance}
          helperText={touched.compliance && errors.compliance}
          disabled={complianceRecordsLoading}
          placeholder="Select"
          hideDropdownPlaceholder
        />
      </View>

      <View style={styles.fieldContainer} testID="surveyTypeFieldContainer">
        <SurveyTypeSelect
          value={values.surveyType}
          onChange={(v) => {
            if (!touched.surveyType) {
              setFieldTouched('surveyType', true);
            }

            setFieldValue('surveyType', v);
          }}
          error={touched.surveyType && errors.surveyType}
          helperText={touched.surveyType && errors.surveyType}
          onFetchError={handleError}
          initialValue={initialSurveyType}
        />
      </View>

      {isCallAccountHCOOrPharmacy && (
        <>
          <View style={styles.fieldContainer} testID="intervieweeFieldContainer">
            <IntervieweeLookupField
              interviewee={values.interviewee}
              callAccountId={call.accountId}
              onChange={(value) => {
                if (!touched.interviewee) {
                  setFieldTouched('interviewee', true);
                }

                setFieldValue('interviewee', value);
              }}
              onFetchError={handleError}
            />
          </View>
          <View style={styles.fieldContainer} testID="otherIntervieweeFieldContainer">
            <TextInput
              label="Other Interviewee"
              value={values.otherInterviewee}
              onChangeText={(val) => {
                if (!touched.otherInterviewee) {
                  setFieldTouched('otherInterviewee', true);
                }

                setFieldValue('otherInterviewee', val);
              }}
              fullWidth
              disabled={false}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContentContainer: {
    width: 700,
  },
  fieldContainer: {
    marginBottom: 14,
  },
});
