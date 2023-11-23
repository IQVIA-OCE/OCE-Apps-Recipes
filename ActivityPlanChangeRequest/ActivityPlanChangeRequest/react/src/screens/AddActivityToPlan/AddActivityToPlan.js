import {
  Autocomplete,
  Paragraph,
  Select,
  Tooltip,
  useTheme,
  Text
} from 'apollo-react-native';
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import ThresholdValueTooltip from '../../components/ThresholdValueTooltip/ThresholdValueTooltip';
import { NAMESPACE } from '../../constants/namespacePrefix';
import {
  accountSelector,
  accountsListSelector,
  picklistsValuesSelector,
} from '../../store/applicationSlice/applicationSelectors';
import { Formik } from 'formik';
import { AddActivityToPlanSchema } from '../../schema';
import { getPicklistValuesByObjectName, isMobilePhone } from '../../helpers';
import { addActivityToPlan } from '../../store/applicationSlice/applicationSlice';
import { ADD_ACCOUNT_TYPE } from '../../constants/updateRecordTypes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddActivityToPlan = () => {
  const picklistValues = useSelector(picklistsValuesSelector);
  const formikRef = useRef();
  const account = useSelector(accountSelector);
  const dispatch = useDispatch();
  const accountsList = useSelector(accountsListSelector);

  const theme = useTheme();

  let styles = { ...stylesDefault, ...stylesIpad };
  if (isMobilePhone) {
    styles = { ...styles, ...stylesIphone };
  }

  return (
    <KeyboardAwareScrollView extraScrollHeight={150} style={{ backgroundColor: theme.colors.background }}>
      <Header
        title={ADD_ACCOUNT_TYPE}
        onSave={() => formikRef.current.handleSubmit()}
      />
      <View style={styles.container} testID="Container">
        <View>
          <Paragraph style={styles.name}>{account.fullName}</Paragraph>
          <Paragraph>{account.address}</Paragraph>
        </View>
        <Formik
          onSubmit={(values) => dispatch(addActivityToPlan(values))}
          validationSchema={AddActivityToPlanSchema}
          initialValues={{
            [`${NAMESPACE}Reason__c`]: null,
            [`${NAMESPACE}ActivityType__c`]: null,
            [`${NAMESPACE}Account__c`]: null,
          }}
          innerRef={formikRef}
        >
          {({ setFieldValue, errors, values }) => (
            <View style={styles.columnWrapper}>
              <View style={styles.customMargin}>
                <Select
                  label="Update type"
                  options={[]}
                  value={{ label: ADD_ACCOUNT_TYPE, value: 'add' }}
                  disabled
                  required
                  width={'100%'}
                />
              </View>
              <View style={styles.customMargin} testID="AccountNameSelect">
                <Autocomplete
                  label="Account Name"
                  placeholder={
                    !values[`${NAMESPACE}Account__c`] ? 'Search Account' : ''
                  }
                  source={accountsList}
                  onChange={(val) => {
                    setFieldValue(`${NAMESPACE}Account__c`, val);
                  }}
                  singleSelect
                  singleSelectValue={`${NAMESPACE}Account__c`}
                  style={{
                    width: '100%',
                  }}
                  required
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
                {isMobilePhone ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Text>Value (Threshold Values)</Text>
                    <View
                      style={{
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip variant="light" placement={'bottom'}>
                        <ThresholdValueTooltip />
                      </Tooltip>
                    </View>
                  </View>
                ) : (
                  <ThresholdValueTooltip extended={true} />
                )}
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

const stylesDefault = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  columnWrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const stylesIpad = StyleSheet.create({
  customMargin: {
    marginVertical: 15,
    paddingHorizontal: 5,
    width: '50%',
    height: 65,
  },
});

const stylesIphone = StyleSheet.create({
  customMargin: {
    marginVertical: 15,
    paddingHorizontal: 5,
    width: '100%',
    height: 'auto',
  },
});

export default AddActivityToPlan;
