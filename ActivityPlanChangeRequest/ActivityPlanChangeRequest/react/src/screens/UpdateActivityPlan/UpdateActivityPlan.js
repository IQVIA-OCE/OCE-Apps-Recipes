import {
  Paragraph,
  Select,
  TextInput,
  Tooltip,
} from 'apollo-react-native/lib/module';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header/Header';
import ThresholdValueTooltip from '../../components/ThresholdValueTooltip/ThresholdValueTooltip';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  accountSelector,
  picklistsValuesSelector,
} from '../../store/applicationSlice/applicationSelectors';
import { NAMESPACE } from '../../constants/namespacePrefix';
import { updateActivityPlan } from '../../store/applicationSlice/applicationSlice';
import { getPicklistValuesByObjectName, isIphone } from '../../helpers';
import { UPDATE_ACTIVITY_TYPE } from '../../constants/updateRecordTypes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditActivityPlanSchema = Yup.object().shape({
  [`${NAMESPACE}ActivityType__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required('Field is required')
    .nullable(),
  [`${NAMESPACE}Reason__c`]: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .required('Field is required')
    .nullable(),
  updatedValue: Yup.number().required('Field is required'),
});

const UpdateActivityPlan = () => {
  const picklistValues = useSelector(picklistsValuesSelector);
  const account = useSelector(accountSelector);
  const formikRef = useRef();
  const dispatch = useDispatch();

  return (
    <KeyboardAwareScrollView extraScrollHeight={150}>
      <Header
        title={UPDATE_ACTIVITY_TYPE}
        onSave={() => formikRef.current.handleSubmit()}
      />
      <View style={styles.container} testID="Container">
        <View>
          <Paragraph style={styles.name}>{account.fullName}</Paragraph>
          <Paragraph>{account.address}</Paragraph>
        </View>
        <Formik
          onSubmit={(values) => dispatch(updateActivityPlan(values))}
          validationSchema={EditActivityPlanSchema}
          initialValues={{
            [`${NAMESPACE}ActivityType__c`]: null,
            [`${NAMESPACE}Reason__c`]: null,
          }}
          innerRef={formikRef}
        >
          {({ setFieldValue, errors, values }) => (
            <View style={styles.columnWrapper}>
              <View style={styles.customMargin}>
                <Select
                  label="Update type"
                  options={[]}
                  value={{ label: UPDATE_ACTIVITY_TYPE, value: 'update' }}
                  disabled
                  required
                  width={'100%'}
                />
              </View>
              <View style={styles.customMargin} testID="ActivityTypeSelect">
                <Select
                  label="Activity type"
                  options={getPicklistValuesByObjectName(
                    picklistValues,
                    `${NAMESPACE}ActivityType__c`
                  )}
                  value={values[`${NAMESPACE}ActivityType__c`]}
                  onChange={(val) =>
                    setFieldValue(`${NAMESPACE}ActivityType__c`, val)
                  }
                  error={errors[`${NAMESPACE}ActivityType__c`]}
                  helperText={errors[`${NAMESPACE}ActivityType__c`]}
                  placeholder="Select item..."
                  width={'100%'}
                  required
                />
              </View>
              <View style={styles.customMargin}>
                <TextInput
                  disabled
                  value={account.activityPlan.HQGoal.toString()}
                  label="Current Value"
                  style={{
                    width: '100%'
                  }}
                />
              </View>
              <View style={styles.customMargin} testID="ValueInput">
                <TextInput
                  placeholder="HQGoal value"
                  keyboardType="numeric"
                  required
                  onChangeText={(value) =>
                    setFieldValue('updatedValue', Number(value))
                  }
                  error={errors.updatedValue}
                  helperText={errors.updatedValue}
                  style={{
                    width: '100%'
                  }}
                  label={
                    <View style={{ flexDirection: 'row', marginBottom: isIphone ? 10 : 5 }}>
                      <Text>Value (Threshold Values)</Text>
                      <View
                        style={{
                          height: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Tooltip variant="light" placement={isIphone ? "bottom" : "right"}>
                          <ThresholdValueTooltip />
                        </Tooltip>
                      </View>
                    </View>
                  }
                />
              </View>
              <View style={styles.customMargin} testID="ReasonSelect">
                <Select
                  label="Reason"
                  options={getPicklistValuesByObjectName(
                    picklistValues,
                    `${NAMESPACE}Reason__c`
                  )}
                  value={values[`${NAMESPACE}Reason__c`]}
                  onChange={(val) =>
                    setFieldValue(`${NAMESPACE}Reason__c`, val)
                  }
                  error={errors[`${NAMESPACE}Reason__c`]}
                  helperText={errors[`${NAMESPACE}Reason__c`]}
                  required
                  placeholder="Select item..."
                  width={'100%'}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customMargin: {
    marginVertical: 15,
    paddingHorizontal: 5,
    width: isIphone ? '100%' : '50%'
  },
  columnWrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap' 
  },
});

export default UpdateActivityPlan;
