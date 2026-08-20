import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';

import {
  useTheme,
  Select,
  Autocomplete,
  Text,
  TextInput,
  Banner,
} from '@oce-apps/apollo-react-native';
import { Header } from './Header';
import { DateField } from '../../components/DateField/DateField';
import { useBanner } from '../../hooks';
import {
  fetchAccountComplianceCycleMetadata,
  fetchAllAccounts,
  fetchInProgressACCNumber,
  saveToDo,
} from '../../api';
import {
  NAMESPACE,
  AccountComplianceCycle__c,
  AccountCompliance__c,
  ToDo__c,
} from '../../constants';
import { normalizeUpdateValues, mapAccount } from '../../utils';
import { ToDoValidationSchema } from './validationSchema';
import { useNavigation } from '@react-navigation/native';

export const CompleteToDo = (props) => {
  const { route } = props;
  const { params } = route;
  const { accountComplianceId, accountName, accountId, compliance, cycle, cycleStartdate } =
    params;

  const theme = useTheme();
  const navigation = useNavigation();

  const formikRef = useRef();
  const [banner, setBanner] = useBanner({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [complianceCycleSurveyType, setComplianceCycleSurveyType] = useState(
    []
  );

  const getSurveyType = async () => {
    try {
      const complianceCycleMetadata =
        await fetchAccountComplianceCycleMetadata();
      const complianceCycleSurveyField = complianceCycleMetadata.fields.find(
        (item) => item.name === `${NAMESPACE}SurveyType__c`
      );
      const complianceCycleSurveyTypePicklist =
        complianceCycleSurveyField.picklistValues.filter(
          (pVal) => pVal.active === true
        );

      setComplianceCycleSurveyType(complianceCycleSurveyTypePicklist);
    } catch (error) {
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  const getAccounts = async (parentId) => {
    try {
      const accountRecords = await fetchAllAccounts(parentId);
      const normalizedAccountRecords = accountRecords.map(mapAccount);
      setAccounts(normalizedAccountRecords);
    } catch (error) {
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  useEffect(() => {
    getSurveyType();
    getAccounts(accountId);
  }, []);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const { totalSize: accInProgressNumber } = await fetchInProgressACCNumber(
        accountComplianceId
      );
      const isLastCycle = accInProgressNumber === 1 ? true : false;
      //If it's a last account compliance cycle, complete AccountCompliance__c
      const sObjectsToUpdate = isLastCycle
        ? [ToDo__c, AccountComplianceCycle__c, AccountCompliance__c]
        : [ToDo__c, AccountComplianceCycle__c];

      const payload = normalizeUpdateValues(sObjectsToUpdate, {
        ...values,
        ...params,
      });

      await saveToDo(payload);
      setBanner({
        variant: 'success',
        message: 'Successefully Completed!',
        visible: true,
        icon: 'checkbox-marked-circle',
      });

      setTimeout(() => {
        navigation.navigate('ToDoScreen', { refreshToDoList: true });
      }, 3000);
    } catch (error) {
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Banner
        variant={banner.variant}
        icon={banner.icon}
        visible={banner.visible}
      >
        {banner.message}
      </Banner>
      <Header
        onComplete={() => formikRef.current.handleSubmit()}
        isSubmitting={isSubmitting}
      />
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.colors.surface }}
      >
        <View style={{ padding: 20 }}>
          <View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Account</Text>
              <Text style={styles.valueText}>{accountName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Compliance</Text>
              <Text style={styles.valueText}>{compliance}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Cycle</Text>
              <Text style={styles.valueText}>{cycle}</Text>
            </View>
          </View>
          <Formik
            onSubmit={handleSubmit}
            validationSchema={ToDoValidationSchema}
            initialValues={{
              surveyType: {},
              cycleStartdate: cycleStartdate,
            }}
            innerRef={formikRef}
          >
            {({ setFieldValue, errors, values }) => (
              <>
                <View>
                  <View style={styles.fieldContainer}>
                    <DateField
                      label="Completion Date"
                      value={values.completionDate}
                      onChange={(val) => setFieldValue('completionDate', val)}
                      hasError={errors.completionDate}
                      helperText={errors.completionDate}
                      required
                      style={{ width: 200 }}
                      disabled={isSubmitting}
                    />
                  </View>
                  <View style={styles.fieldContainer} testID={'surveyTypeContainer'}>
                    <Select
                      fullWidth
                      label="Survey Type"
                      required
                      options={complianceCycleSurveyType}
                      onChange={(val) => setFieldValue('surveyType', val)}
                      value={values.surveyType}
                      error={errors.surveyType}
                      helperText={errors.surveyType?.value}
                      disabled={isSubmitting}
                      hideDropdownPlaceholder
                    />
                  </View>
                  <View style={{ ...styles.fieldContainer, width: '100%' }} testID={'intervieweeContainer'}>
                    <Autocomplete
                      label="Interviewee"
                      source={accounts}
                      singleSelectValue={values.interviewee}
                      onChange={(val) => setFieldValue('interviewee', val)}
                      singleSelect
                      style={{ width: '100%' }}
                      disabled={isSubmitting}
                      fullWidth
                    />
                  </View>
                  <View style={styles.fieldContainer}>
                    <TextInput
                      label="Other Interviewee"
                      value={values.otherInterviewee}
                      onChangeText={(val) =>
                        setFieldValue('otherInterviewee', val)
                      }
                      fullWidth
                      disabled={isSubmitting}
                    />
                  </View>
                </View>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    marginRight: 20,
    marginBottom: 15,
    flex: 1,
    maxWidth: 310,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  labelText: {
    marginRight: 15,
    fontWeight: '600',
    width: 100,
    fontSize: 14,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '300',
  },
});
