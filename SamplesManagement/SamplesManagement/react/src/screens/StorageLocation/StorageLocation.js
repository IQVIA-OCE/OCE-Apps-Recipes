import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  TextInput,
  Select,
  Checkbox,
  ActivityIndicator,
  Colors,
  Banner,
  Tooltip,
  useTheme
} from 'apollo-react-native';
import FormHeader from '../../components/FormHeader/FormHeader';

import {
  saveLocations,
  fetchCountries,
  fetchLocationById,
} from '../../api/StorageLocation';
import { useBanner, useFetcher, useHandleData } from '../../hooks';
import { Formik } from 'formik';
import Loader from '../../components/Loader/Loader';

import { normalizeLocation, normalizeStates } from './utils';
import validationSchema from './validationSchema';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppContext } from '../../../AppContext';
import InfoField from './InfoField';
import Info from './Info';

const initial = {
  address1: '',
  address2: '',
  city: '',
  country: '',
  state: '',
  zip: '',
  default: false,
};

const StorageLocation = ({ navigation }) => {
  const { username } = useContext(AppContext);
  const [banner, setBanner] = useBanner();
  const [countries] = useFetcher(
    async () => await fetchCountries(),
    normalizeStates
  );
  const id = navigation.getParam('locationId');
  const [location] = useFetcher(
    async () => await fetchLocationById(id),
    normalizeLocation
  );

  const theme = useTheme();

  const [{ submitting, needRedirect }, setValue] = useState({
    submitting: false,
    needRedirect: false,
  });

  const handleCreate = async (value, { resetForm, setValues }) => {
    setValue(prevState => ({ ...prevState, submitting: true }));

    try {
      await saveLocations(value, id);
      let message = 'Samples Management Address was created.';
      resetForm();
      setValue(prevState => ({ ...prevState, submitting: false }));
      if (id) {
        // resetFrom is not working properly if form initialized populated
        setValues(initial);
        navigation.setParams({
          locationId: null,
        });
        message = `Samples Management Address "${value.address1}" was saved.`;
      }
      if (needRedirect) {
        setTimeout(() => {
          navigation.navigate('StorageLocationList', { refresh: true });
        }, 1500);
      }
      setBanner({
        variant: 'success',
        message,
        visible: true,
        icon: 'checkbox-marked-circle',
      });
    } catch (e) {
      setValue(prevState => ({ ...prevState, submitting: false }));
      setBanner({
        variant: 'error',
        message: e.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  if (countries.loading || location.loading)
    return (
      <ActivityIndicator
        animating={true}
        color={Colors.blue}
        style={{ paddingVertical: 10 }}
      />
    );

  // fill selects with object data if editing location
  if (
    countries.data &&
    countries.data.length &&
    location.loading == false &&
    location.data &&
    location.data.length &&
    location.data[0].country &&
    typeof location.data[0].country === 'string'
  ) {
    const data = location.data[0];
    data.country = countries.data.filter(el => el.id === data.country)[0];

    if (data.state) {
      data.state = data.country.states.filter(el => el.id === data.state)[0];
    }
  }
  return (
    <KeyboardAwareScrollView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Formik
        initialValues={
          location.data && location.data.length ? location.data[0] : initial
        }
        onSubmit={handleCreate}
        validationSchema={validationSchema}
        validateOnMount={true}
        enableReinitialized
      >
        {({
          handleSubmit,
          values,
          setFieldValue,
          isSubmitting,
          errors,
          touched,
          isValid,
        }) => {
          return (
            <>
              <Banner
                variant={banner.variant}
                icon={banner.icon}
                visible={banner.visible}
              >
                {banner.message}
              </Banner>
              <Banner
                variant={'error'}
                icon={'alert-circle'}
                visible={!isValid && Object.keys(touched).length}
              >
                Review the errors on this page.
              </Banner>
              {submitting && <Loader />}
              <FormHeader
                title={
                  id
                    ? `Edit ${values.address1}`
                    : 'New Samples Management Addresses'
                }
                controls={[
                  {
                    label: 'Cancel',
                    onPress: () => navigation.goBack(),
                  },
                  {
                    label: 'Save & New',
                    disabled: isSubmitting,
                    onPress: () => {
                      setValue(prevState => ({
                        ...prevState,
                        needRedirect: false,
                      }));
                      handleSubmit();
                    },
                  },
                  {
                    label: 'Save',
                    color: 'primary',
                    mode: 'contained',
                    disabled: isSubmitting,
                    onPress: () => {
                      setValue(prevState => ({
                        ...prevState,
                        needRedirect: true,
                      }));
                      handleSubmit();
                    },
                  },
                ]}
              />
              <View style={styles.form}>
                <View style={styles.col}>
                  <View style={[styles.fieldContainer, { paddingRight: 40 }]}>
                    <TextInput
                      fullWidth
                      label="Address Line 1"
                      style={styles.field}
                      value={values.address1}
                      onChangeText={val => setFieldValue('address1', val)}
                      error={errors.address1 && touched.address1}
                      helperText={
                        errors.address1 && touched.address1 && errors.address1
                      }
                      required
                    />
                  </View>
                  <View style={styles.fieldContainer}>
                    <TextInput
                      fullWidth
                      label="Address Line 2"
                      style={styles.field}
                      value={values.address2}
                      onChangeText={val => setFieldValue('address2', val)}
                      error={errors.address2 && touched.address2}
                      helperText={
                        errors.address2 && touched.address2 && errors.address2
                      }
                    />
                    <Tooltip
                      color="#b0adab"
                      subtitle="The second line of the street address for the User. This is used to store all second line street addresses in the samples management."
                      placement="top"
                    />
                  </View>
                  <View style={styles.fieldContainer}>
                    <TextInput
                      fullWidth
                      label="City"
                      style={styles.field}
                      value={values.city}
                      onChangeText={val => setFieldValue('city', val)}
                      error={errors.city && touched.city}
                      helperText={errors.city && touched.city && errors.city}
                      required
                    />
                    <Tooltip
                      color="#b0adab"
                      subtitle="City of the address. This is used to store all cities of an address in the samples management."
                      placement="top"
                    />
                  </View>
                  {useHandleData(countries)(data => (
                    <>
                      <View style={styles.fieldContainer}>
                        <Select
                          fullWidth
                          options={data}
                          label="Country"
                          style={styles.field}
                          value={values.country}
                          onChange={val => {
                            setFieldValue('country', val);
                            setFieldValue('state', '');
                          }}
                        />
                        <Tooltip
                          color="#b0adab"
                          subtitle="City of the address. This is used to store all cities of an address in the samples management."
                          placement="top"
                        />
                      </View>
                      <View style={styles.fieldContainer}>
                        <Select
                          fullWidth
                          disabled={!(values.country && values.country.states)}
                          options={
                            (values.country && values.country.states) || []
                          }
                          label="State"
                          style={styles.field}
                          value={values.state}
                          onChange={val => setFieldValue('state', val)}
                        />
                        <Tooltip
                          color="#b0adab"
                          subtitle="State of the address. This is used to store all states of an address in the samples management."
                          placement="top"
                        />
                      </View>
                    </>
                  ))}
                  <View style={[styles.fieldContainer]}>
                    <TextInput
                      fullWidth
                      label="Zip Code"
                      style={styles.field}
                      value={values.zip}
                      onChangeText={val => setFieldValue('zip', val)}
                    />
                    <Tooltip
                      color="#b0adab"
                      subtitle="Zip Code of the address. This is used to store all zip codes of an address in the samples management."
                      placement="top"
                    />
                  </View>
                </View>
                <View style={styles.col}>
                  <View style={[styles.checkboxField, styles.fieldContainer]}>
                    <Checkbox
                      style={styles.field}
                      onPress={() => setFieldValue('default', !values.default)}
                      status={values.default ? 'checked' : 'unchecked'}
                      label="Is Default Storage Location?"
                    />
                    <Tooltip
                      color="#b0adab"
                      subtitle="Set true for default storage location"
                      placement="top"
                    />
                  </View>
                  <InfoField label="Owner" text={username} />
                </View>
              </View>
              {id && <Info values={values} />}
            </>
          );
        }}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  form: {
    padding: 10,
    flexDirection: 'row',
  },
  col: {
    paddingHorizontal: 15,
    flex: 1,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  field: {
    flex: 1,
  },
  checkboxField: {
    paddingTop: 30,
    marginLeft: -10,
    marginBottom: 20,
  },
});

export default StorageLocation;
