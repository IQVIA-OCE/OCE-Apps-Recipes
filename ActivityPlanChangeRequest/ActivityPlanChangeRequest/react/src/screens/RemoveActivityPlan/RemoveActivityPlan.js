import {
  Checkbox,
  Paragraph,
  Select,
  Tooltip,
  Text,
  useTheme
} from 'apollo-react-native';
import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import ThresholdValueTooltip from '../../components/ThresholdValueTooltip/ThresholdValueTooltip';
import { NAMESPACE } from '../../constants/namespacePrefix';
import {
  accountSelector,
  picklistsValuesSelector,
} from '../../store/applicationSlice/applicationSelectors';
import { Formik } from 'formik';
import { RemoveActivityPlanSchema } from '../../schema';
import { getPicklistValuesByObjectName, isMobilePhone } from '../../helpers';
import { removeActivityPlan } from '../../store/applicationSlice/applicationSlice';
import { REMOVE_ACCOUNT_TYPE } from '../../constants/updateRecordTypes';

const RemoveActivityPlan = () => {
  const picklistValues = useSelector(picklistsValuesSelector);
  const formikRef = useRef();
  const account = useSelector(accountSelector);
  const dispatch = useDispatch();

  const theme = useTheme();

  let styles = { ...stylesDefault, ...stylesIpad };
  if (isMobilePhone) {
    styles = { ...styles, ...stylesIphone };
  }

  return (
    <ScrollView
      testID="RemoveActivityPlan"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Header
        title="Edit Activity Plan"
        onSave={() => formikRef.current.handleSubmit()}
      />
      <View style={styles.container} testID="Container">
        <View>
          <Paragraph style={styles.name}>{account.fullName}</Paragraph>
          <Paragraph>{account.address}</Paragraph>
        </View>
        <Formik
          onSubmit={(values) => dispatch(removeActivityPlan(values))}
          validationSchema={RemoveActivityPlanSchema}
          initialValues={{
            [`${NAMESPACE}Reason__c`]: null,
            [`${NAMESPACE}Confirmation__c`]: false,
          }}
          innerRef={formikRef}
        >
          {({ setFieldValue, errors, values }) => (
            <View style={styles.columnWrapper}>
              <View style={styles.customMargin }>
                <Select
                  label="Update type"
                  options={[]}
                  value={{ label: REMOVE_ACCOUNT_TYPE, value: 'update' }}
                  disabled
                  required
                  width={'100%'}
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
                    <Tooltip variant="light" placement={isMobilePhone ? "bottom" : "right"}>
                      <ThresholdValueTooltip />
                    </Tooltip>
                  </View>
                </View>
                ) : (
                  <ThresholdValueTooltip extended={true}/>
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
              <View style={styles.customMargin, styles.confirmWrapper} testID="ConfirmCheckbox">
                <Checkbox
                  onChange={() =>
                    setFieldValue(
                      `${NAMESPACE}Confirmation__c`,
                      !values[`${NAMESPACE}Confirmation__c`]
                    )
                  }
                  checked={values[`${NAMESPACE}Confirmation__c`]}
                  label={
                    <View>
                      <Text style={{ fontWeight: '300' }}>
                        I confirm, that I want to{' '}
                      </Text>
                      <Text style={{ fontWeight: '500' }}>
                        remove this HCP from all my activity plan
                      </Text>
                    </View>
                  }
                />
                {errors[`${NAMESPACE}Confirmation__c`] && (
                  <Text style={{ color: 'red' }}>
                    {errors[`${NAMESPACE}Confirmation__c`]}
                  </Text>
                )}
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
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
    flexWrap: 'wrap'
  },
});

const stylesIpad = StyleSheet.create({
  customMargin: {
    marginVertical: 15,
    paddingHorizontal: 5,
    width: '50%',
    height: 65,
  },
  confirmWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  }
});

const stylesIphone = StyleSheet.create({
  customMargin: {
    marginVertical: 15,
    paddingHorizontal: 5,
    width: '100%',
    height: 'auto',
  },
  confirmWrapper: {
    width: '100%'
  }
});

export default RemoveActivityPlan;
