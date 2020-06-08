import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, FieldArray } from 'formik';
import { useFetcher, useBanner } from '../../hooks';
import { AppContext } from '../../../AppContext';
import { environment } from '../../../bridge/EnvironmentData/EnvironmentData.native';
import { normalizeProductsList } from './utils';
import { getValidationSchema } from './validationSchema';
import initialFormValues from './initialFormValues';

import {
  fetchSampleProducts,
  saveFormDetails,
  saveFormProduct,
  saveTransferInDetails,
} from '../../api/SampleTransaction';

import { Banner } from 'apollo-react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import FormPanel from './FormPanel/FormPanel';
import TransactionTable from './TransactionTable/TransactionTable';
import ProductsList from '../../components/ProductsList/ProductsList';
import Loader from '../../components/Loader/Loader';

const SampleTransaction = ({ navigation }) => {
  const recordType = navigation.getParam('recordType');
  const [
    { submitting, formSubmitType, selectedProductIds },
    setValue,
  ] = useState({
    submitting: false,
    formSubmitType: 'Save',
    selectedProductIds: [],
  });
  const { username } = useContext(AppContext);
  const userId = environment.userID();
  const user = {
    Name: username,
    Id: userId,
  };

  let [products, productsActions] = useFetcher(
    async () => await fetchSampleProducts(recordType.DeveloperName)
  );

  const [banner, setBanner] = useBanner();

  const handleFormSubmit = async values => {
    setValue(prevState => ({ ...prevState, submitting: true }));
    try {
      const [sampleTransaction] = await saveFormDetails(values, formSubmitType);

      const formProductPromises = values.products.map(async product => {
        saveFormProduct(
          product,
          sampleTransaction.id,
          values.recordType.DeveloperName
        );
      });
      await Promise.all(formProductPromises);

      setValue(prevState => ({
        ...prevState,
        submitting: false,
      }));

      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 1500);

      setBanner({
        variant: 'success',
        message: `Successfully ${
          formSubmitType == 'submit' ? 'submitted' : 'saved'
        }`,
        visible: true,
        icon: 'checkbox-marked-circle',
      });

      if (
        values.recordType.DeveloperName == 'TransferOut' &&
        formSubmitType == 'submit'
      ) {
        createTransferInForTransferOut(values, sampleTransaction.id);
      }
    } catch (error) {
      setValue(prevState => ({
        ...prevState,
        submitting: false,
      }));

      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });

      console.log(error);
    }
  };

  const createTransferInForTransferOut = async (values, relatedTransactionId) => {
    try {
      const transferInValues = {
        ...values,
        OCE__FromSalesRep__c: values.fields.toSalesRep.value,
        OCE__FromSalesRepTerritory__c: values.fields.toSalesRepTerritory,
        OCE__ToSalesRep__c: values.fields.user.Id,
        OCE__ToSalesRepTerritory__c: values.fields.territory.name,
        OCE__Status__c: 'In Progress',
        OwnerId: values.fields.user.Id,
        OCE__RelatedTransactionId__c: relatedTransactionId,
        OCE__IsSystemCreated__c: true,
        OCE__TransactionRep__c: values.fields.user.Id,
      };
      const [transferInTransaction] = await saveTransferInDetails(
        transferInValues
      );

      const formProductPromises = values.products.map(async product => {
        saveFormProduct(
          product,
          transferInTransaction.id,
          values.recordType.DeveloperName
        );
      });
      await Promise.all(formProductPromises);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectProduct = id => {
    setValue(prevState => ({
      ...prevState,
      selectedProductIds: [...selectedProductIds, id],
    }));
  };

  const handleDeselectProduct = deselectId => {
    setValue(prevState => ({
      ...prevState,
      selectedProductIds: selectedProductIds.filter(id => id !== deselectId),
    }));
  };

  return (
    <KeyboardAwareScrollView
      scrollEnabled={true}
      automaticallyAdjustContentInsets={false}
      keyboardShouldPersistTaps="always"
      scrollEventThrottle={10}
      contentContainerStyle={{ flexGrow: 1 }}
      style={styles.root}
    >
      <Formik
        enableReinitialize
        initialValues={{
          fields: {
            ...initialFormValues[recordType.DeveloperName],
            user,
            transactionRep: user,
          },
          products: [],
          recordType: recordType,
        }}
        onSubmit={handleFormSubmit}
        validateOnMount={true}
        validationSchema={getValidationSchema(recordType.DeveloperName)}
      >
        {({
          handleSubmit,
          values,
          isSubmitting,
          isValid,
          touched,
          errors,
          setFieldValue,
        }) => (
          <>
            {submitting && <Loader />}

            <Banner
              variant={'error'}
              icon={'alert-circle'}
              visible={!isValid && Object.keys(touched).length}
            >
              {`Validation errors. ${
                errors && errors.products && typeof errors.products === 'string'
                  ? errors.products
                  : ''
              }`}
            </Banner>

            <Banner
              variant={banner.variant}
              icon={banner.icon}
              visible={banner.visible}
            >
              {banner.message}
            </Banner>

            <View style={{ flex: 2 }}>
              <FormHeader
                iconColor="#34becd"
                label={recordType.Name}
                title="New Sample Transaction"
                controls={[
                  {
                    label: 'Cancel',
                    onPress: () => navigation.navigate('Dashboard'),
                  },
                  {
                    label: 'Save',
                    color: 'primary',
                    mode: 'contained',
                    onPress: () => {
                      setFieldValue('formStatus', 'Saving');
                      setValue(prevState => ({
                        ...prevState,
                        formSubmitType: 'save',
                      }));
                      handleSubmit();
                    },
                    disabled: isSubmitting,
                  },
                  {
                    label: 'Submit',
                    color: 'primary',
                    mode: 'contained',
                    onPress: () => {
                      setFieldValue('formStatus', 'Submitting');
                      setValue(prevState => ({
                        ...prevState,
                        formSubmitType: 'submit',
                      }));
                      handleSubmit();
                    },
                    disabled: isSubmitting,
                  },
                ]}
              />
              <FormPanel recordType={recordType.DeveloperName} />
            </View>

            <FieldArray name="products">
              {props => {
                const onAddClick = id => {
                  handleSelectProduct(id);
                  const data = normalizeProductsList(
                    products.data,
                    recordType.DeveloperName,
                    selectedProductIds
                  );
                  props.push(data.byId[id]);
                };
                const onRemoveClick = id => {
                  handleDeselectProduct(id);
                  setFieldValue('products', [
                    ...values.products.filter(prod => prod.Id != id),
                  ]);
                };

                return (
                  <View
                    style={{
                      flex: 3,
                      flexDirection: 'row',
                    }}
                  >
                    <View style={{ flex: 3 }}>
                      <ProductsList
                        data={normalizeProductsList(
                          products.data,
                          recordType.DeveloperName,
                          selectedProductIds
                        )}
                        refreshing={products.loading}
                        onRefresh={productsActions.handleFetch}
                        onItemPress={onAddClick}
                      />
                    </View>
                    <View style={{ flex: 9 }}>
                      <TransactionTable
                        {...props}
                        rows={props.form.values.products}
                        removeRow={onRemoveClick}
                      />
                    </View>
                  </View>
                );
              }}
            </FieldArray>
          </>
        )}
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
  field: {
    width: '100%',
    marginBottom: 15,
  },
  checkboxField: {
    paddingTop: 30,
    marginLeft: -10,
  },
});

export default SampleTransaction;
