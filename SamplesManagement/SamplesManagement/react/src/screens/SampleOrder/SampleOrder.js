import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, FieldArray } from 'formik';
import { useFetcher, useBanner } from '../../hooks';
import { AppContext } from '../../../AppContext';
import { environment } from '../../../bridge/EnvironmentData/EnvironmentData.native';
import {
  getSampleOrderConfigById,
  normalizeProductsList,
  normalizeProductTerritoryAllocationRecords,
} from './utils';
import { getValidationSchema } from './validationSchema';
import initialFormValues from './initialFormValues';

import {
  fetchSampleProducts,
  fetchSampleOrderConfig,
  fetchUserProfile,
  fetchOrgId,
  fetchProductTerritoryAllocationRecords,
  saveFormDetails,
  updateFormDetailsStatus,
  saveFormProduct,
} from '../../api/SampleOrder';

import { Banner } from 'apollo-react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import FormPanel from './FormPanel/FormPanel';
import ProductsTable from './ProductsTable/ProductsTable';
import ProductsList from '../../components/ProductsList/ProductsList';
import Loader from '../../components/Loader/Loader';

const SampleTransaction = ({ navigation }) => {
  let [
    { submitting, formSubmitType, selectedProductIds, sampleOrderConfig },
    setValue,
  ] = useState({
    submitting: false,
    formSubmitType: 'Save',
    selectedProductIds: [],
    sampleOrderConfig: {},
  });
  const { username } = useContext(AppContext);
  const userId = environment.userID();
  const user = {
    Name: username,
    Id: userId,
  };

  let [sampleOrderConfigData] = useFetcher(fetchSampleOrderConfig);
  let [userProfile] = useFetcher(async () => await fetchUserProfile(userId));
  let [organizationData] = useFetcher(fetchOrgId);

  if (
    !sampleOrderConfigData.loading &&
    sampleOrderConfigData.data &&
    sampleOrderConfigData.data.length &&
    userProfile.data &&
    userProfile.data.length &&
    !userProfile.loading &&
    organizationData.data &&
    organizationData.data.length &&
    !organizationData.loading
  ) {
    const userConfig = getSampleOrderConfigById(
      sampleOrderConfigData.data,
      userId
    );
    const profileConfig = getSampleOrderConfigById(
      sampleOrderConfigData.data,
      userProfile.data[0].ProfileId
    );
    const orgConfig = getSampleOrderConfigById(
      sampleOrderConfigData.data,
      organizationData.data[0].Id
    );

    sampleOrderConfig = userConfig
      ? userConfig
      : profileConfig
      ? profileConfig
      : orgConfig;
  }

  let [productTerritoryAllocationRecords] = useFetcher(
    fetchProductTerritoryAllocationRecords,
    normalizeProductTerritoryAllocationRecords
  );

  let [products, productsActions] = useFetcher(fetchSampleProducts);

  const [banner, setBanner] = useBanner();

  const handleFormSubmit = async values => {
    setValue(prevState => ({ ...prevState, submitting: true }));
    try {
      const [sampleOrder] = await saveFormDetails(values, values.fields.status);

      const formProductPromises = values.products.map(async product => {
        saveFormProduct(product, sampleOrder.id);
      });
      await Promise.all(formProductPromises);

      if (formSubmitType == 'submit') {
        if (sampleOrderConfig.enableProductAllocation) {
          const allocationWarningProducts = values.products.filter(product => {
            if (product.remainingAllocation) {
              return product.remainingAllocation < product.quantity;
            } else {
              return false;
            }
          });
          if (allocationWarningProducts.length) {
            await updateFormDetailsStatus(
              sampleOrder.id,
              values,
              'Pending Approval'
            );

            setBanner({
              variant: 'warning',
              message: `Sample order quantity is greater than the allocated quantity. The sample order was submitted for approval.`,
              visible: true,
              icon: 'checkbox-marked-circle',
            });
          } else {
            await updateFormDetailsStatus(
              sampleOrder.id,
              values,
              sampleOrderConfig.finalStatus
            );

            setBanner({
              variant: 'success',
              message: `Successfully submitted`,
              visible: true,
              icon: 'checkbox-marked-circle',
            });
          }
        } else {
          await updateFormDetailsStatus(
            sampleOrder.id,
            values,
            sampleOrderConfig.finalStatus
          );
          setBanner({
            variant: 'success',
            message: `Successfully submitted`,
            visible: true,
            icon: 'checkbox-marked-circle',
          });
        }
      } else {
        setBanner({
          variant: 'success',
          message: `Successfully saved`,
          visible: true,
          icon: 'checkbox-marked-circle',
        });
      }

      setValue(prevState => ({
        ...prevState,
        submitting: false,
      }));

      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 3000);
    } catch (e) {
      setValue(prevState => ({
        ...prevState,
        submitting: false,
      }));

      setBanner({
        variant: 'error',
        message: e.message,
        visible: true,
        icon: 'alert-circle',
      });
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
            ...initialFormValues,
            user,
            transactionRep: user,
          },
          products: [],
          orderCheck: sampleOrderConfig.orderCheck,
        }}
        onSubmit={handleFormSubmit}
        validateOnMount={true}
        validationSchema={getValidationSchema()}
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
                label="Sample Order"
                title="New Sample Order"
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
              <FormPanel />
            </View>

            <FieldArray name="products">
              {props => {
                const onAddClick = id => {
                  handleSelectProduct(id);
                  const data = normalizeProductsList(
                    products.data,
                    selectedProductIds,
                    productTerritoryAllocationRecords.data
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
                          selectedProductIds,
                          productTerritoryAllocationRecords.data
                        )}
                        refreshing={products.loading}
                        onRefresh={productsActions.handleFetch}
                        onItemPress={onAddClick}
                      />
                    </View>
                    <View style={{ flex: 9 }}>
                      <ProductsTable
                        {...props}
                        rows={props.form.values.products}
                        removeRow={onRemoveClick}
                        showProductAllocationRemaining={
                          sampleOrderConfig.showProductAllocationRemaining &&
                          sampleOrderConfig.enableProductAllocation
                        }
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
