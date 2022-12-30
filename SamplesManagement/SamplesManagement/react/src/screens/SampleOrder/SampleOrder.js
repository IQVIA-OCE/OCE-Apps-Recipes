import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, FieldArray } from 'formik';
import { useFetcher, useBanner } from '../../hooks';
import { AppContext } from '../../../AppContext';
import { environment } from 'oce-apps-bridges';
import {
  getSampleOrderConfigById,
  normalizeProductsList,
  normalizeProductTerritoryAllocationRecords,
  mapOrderDetails,
  mapOrderProducts,
  mapFormDetails,
  mapFormProducts,
} from './utils';
import { getValidationSchema } from './validationSchema';
import {
  fetchSampleProducts,
  fetchSampleOrderConfig,
  fetchUserProfile,
  fetchOrgId,
  fetchProductTerritoryAllocationRecords,
  saveSampleOrder,
  updateFormDetailsStatus,
  saveSampleOrderProduct,
  fetchOrderDetails,
  fetchOrderProducts,
  deleteSampleOrderProduct,
  deleteSampleOrder,
} from '../../api/SampleOrder';

import { Banner, themeGrey } from 'apollo-react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import FormPanel from './FormPanel/FormPanel';
import ProductsTable from './ProductsTable/ProductsTable';
import ProductsList from '../../components/ProductsList/ProductsList';
import Loader from '../../components/Loader/Loader';
import {normalizer} from "../../utils/utils";

const SampleOrder = ({ navigation }) => {
  let [
    {
      submitting,
      disabledButtons,
      formSubmitType,
      selectedProducts,
      sampleOrderConfig,
      readonly,
      isPreviewPrevScreen,
      orderId,
      isCloned,
      clonedFromId,
    },
    setValue,
  ] = useState({
    submitting: false,
    disabledButtons: false,
    formSubmitType: 'Save',
    selectedProducts: [],
    sampleOrderConfig: {},
    readonly: navigation.getParam('readonly') ? true : false,
    isPreviewPrevScreen: navigation.getParam('readonly') ? true : false,
    orderId: navigation.getParam('id') || null,
    isCloned: false,
    clonedFromId: null,
  });
  const { username } = useContext(AppContext);
  const userId = environment.userID();
  const user = {
    Name: username,
    Id: userId,
  };

  let [sampleOrderConfigData] = useFetcher(fetchSampleOrderConfig);
  let [userProfile] = useFetcher(
      async () => await fetchUserProfile(userId),
      normalizer({ OCE__ProfileId__c: 'profileId' })
  );

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
      userProfile.data[0].profileId
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

  const [orderDetails] = useFetcher(
    async () => await fetchOrderDetails(orderId),
    mapOrderDetails
  );

  const [orderProducts] = useFetcher(
    async () => await fetchOrderProducts(orderId),
    mapOrderProducts
  );

  const getOrderProductRemainingAllocation = orderProduct => {
    const allocationRecord = productTerritoryAllocationRecords.data
      ? productTerritoryAllocationRecords.data.find(
          prodAllocation => prodAllocation.id == orderProduct.sampleProductId
        )
      : null;

    const remainingAllocation = allocationRecord
      ? allocationRecord.remainingAllocation
      : null;

    return {
      ...orderProduct,
      remainingAllocation: remainingAllocation ? remainingAllocation : 'NA',
    };
  };

  const getInitialData = orderId => {
    if (orderId) {
      const products = orderProducts.data
        ? orderProducts.data.map(getOrderProductRemainingAllocation)
        : [];

      return {
        fields: {
          ...orderDetails.data,
          user,
          transactionRep: user,
        },
        products,
        orderCheck: sampleOrderConfig.orderCheck,
      };
    }

    return getNewOrderData();
  };

  const getNewOrderData = () => {
    return {
      fields: {
        isUrgent: false,
        comments: '',
        status: 'In Progress',
        territory: environment.territory(),
        shipTo: null,
        user,
        transactionRep: user,
      },
      products: [],
      orderCheck: sampleOrderConfig.orderCheck,
    };
  };

  useEffect(() => {
    if (
      orderProducts.data != null &&
      productTerritoryAllocationRecords.data != null
    ) {
      setValue(prevState => ({
        ...prevState,
        selectedProducts: orderProducts.data || [],
      }));
    }
  }, [orderProducts, readonly]);

  const getDeletedSampleOrderProducts = values => {
    const deletedDetailRecords = orderProducts.data
      ? orderProducts.data.filter(initialProduct => {
          const formProductValue = values.products
            ? values.products.find(p => p.id == initialProduct.id)
            : null;
          if (!formProductValue) {
            return true;
          }
          return false;
        })
      : [];

    return deletedDetailRecords.map(deletedDetailRecord => ({
      ...deletedDetailRecord,
      deleted: true,
    }));
  };

  const handleFormSubmit = async values => {
    setValue(prevState => ({ ...prevState, submitting: true }));
    try {
      const sampleOrderDetails = mapFormDetails(values);
      const [sampleOrder] = await saveSampleOrder(sampleOrderDetails, orderId);
      const savedSampleOrderId = sampleOrder ? sampleOrder.id : orderId;

      const deletedSampleOrderProducts = getDeletedSampleOrderProducts(values);
      const sampleOrderProducts = values.products.map(product =>
        mapFormProducts(product, savedSampleOrderId)
      );

      const savedSampleOrderPromises = sampleOrderProducts.map(product =>
        saveSampleOrderProduct(product)
      );
      const deletedSampleOrderProductsPromises = deletedSampleOrderProducts.map(
        product => deleteSampleOrderProduct(product.id)
      );

      await Promise.all([
        ...savedSampleOrderPromises,
        ...deletedSampleOrderProductsPromises,
      ]);

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
              savedSampleOrderId,
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
              savedSampleOrderId,
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
            savedSampleOrderId,
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
        disabledButtons: true,
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

  const handleSelectProduct = product => {
    setValue(prevState => ({
      ...prevState,
      selectedProducts: [...selectedProducts, product],
    }));
  };

  const handleDeselectProduct = product => {
    setValue(prevState => ({
      ...prevState,
      selectedProducts: selectedProducts.filter(selectedProduct => {
        return !(
          selectedProduct.sampleProductId === product.sampleProductId &&
          selectedProduct.id === product.id
        );
      }),
    }));
  };

  const deleteOrderWithDetails = async (id, values) => {
    setValue(prevState => ({ ...prevState, submitting: true }));

    try {
      const sampleOrderProductPromises = values.products.map(async product => {
        return deleteSampleOrderProduct(product.id);
      });

      await Promise.all(sampleOrderProductPromises);
      await deleteSampleOrder(id);

      setBanner({
        variant: 'success',
        message: 'Successfully deleted.',
        visible: true,
        icon: 'checkbox-marked-circle',
      });

      setValue(prevState => ({
        ...prevState,
        submitting: false,
        disabledButtons: true,
      }));

      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 3000);
    } catch (error) {
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  const cloneSampleOrder = (values, setFieldValue) => {
    const clonedFromId = orderId;
    setValue(prevState => ({
      ...prevState,
      orderId: null,
      readonly: false,
      isCloned: true,
      clonedFromId,
    }));
    const sampleOrderClonedProducts = values.products.map(product => ({
      ...product,
      id: null,
      orderId: null,
    }));
    orderProducts.data = [];
    setFieldValue('products', sampleOrderClonedProducts);
    setFieldValue('fields', { ...values.fields, status: 'In Progress' });
  };

  const getFormControls = (
    values,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    resetForm
  ) => {
    if (readonly) {
      if (values.fields.status == 'In Progress') {
        return [
          {
            label: 'Back',
            onPress: () => navigation.navigate('Dashboard'),
            disabled: isSubmitting || disabledButtons,
          },
          {
            label: 'Clone',
            onPress: () => cloneSampleOrder(values, setFieldValue),
            disabled: isSubmitting || disabledButtons,
          },
          {
            label: 'Edit',
            onPress: () =>
              setValue(prevState => ({
                ...prevState,
                readonly: false,
              })),
            disabled: isSubmitting || disabledButtons,
          },
          {
            label: 'Delete',
            color: 'primary',
            mode: 'contained',
            onPress: () => deleteOrderWithDetails(orderId, values),
            disabled: isSubmitting || disabledButtons,
          },
        ];
      } else {
        return [
          {
            label: 'Back',
            onPress: () => navigation.navigate('Dashboard'),
            disabled: isSubmitting || disabledButtons,
          },
          {
            label: 'Clone',
            onPress: () => cloneSampleOrder(values, setFieldValue),
            disabled: isSubmitting || disabledButtons,
          },
        ];
      }
    } else {
      return [
        {
          label: 'Cancel',
          onPress: () => {
            if (isPreviewPrevScreen && !isCloned) {
              setValue(prevState => ({
                ...prevState,
                readonly: true,
              }));
              const initialFormValues = getInitialData(orderId);
              resetForm(initialFormValues);
            } else if (isCloned) {
              navigation.navigate({
                routeName: 'SampleOrder',
                params: {
                  recordType: {
                    DeveloperName: 'Order',
                    Name: 'Order',
                  },
                  readonly: true,
                  id: clonedFromId,
                },
                key: `${Math.random () * 10000}_clonedFromId`,
              });
            } else {
              navigation.navigate('Dashboard');
            }
          },
          disabled: isSubmitting || disabledButtons,
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
          disabled: isSubmitting || disabledButtons,
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
          disabled: isSubmitting || disabledButtons,
        },
      ];
    }
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
        initialValues={getInitialData(orderId)}
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
          resetForm,
        }) => (
          <>
            {submitting || orderProducts.loading || orderDetails.loading ? (
              <Loader />
            ) : null}
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

            <View styles={{ flexGrow: 1, flexBasis: 1 }}>
              <FormHeader
                iconColor="#34becd"
                label="Sample Order"
                title={
                  orderId && orderDetails.data
                    ? orderDetails.data.name
                    : 'New Sample Order'
                }
                controls={getFormControls(
                  values,
                  isSubmitting,
                  setFieldValue,
                  handleSubmit,
                  resetForm
                )}
              />
              <FormPanel readonly={readonly} />
            </View>

            <FieldArray name="products">
              {props => {
                const onAddClick = product => {
                  handleSelectProduct(product);

                  props.push(product);
                };
                const onRemoveClick = productToDeselect => {
                  handleDeselectProduct(productToDeselect);

                  const filteredProducts = values.products.filter(prod => {
                    return !(
                      prod.sampleProductId ===
                        productToDeselect.sampleProductId &&
                      prod.id === productToDeselect.id
                    );
                  });

                  setFieldValue('products', filteredProducts);
                };

                return (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      borderTopWidth: 1,
                      borderTopColor: themeGrey[200],
                    }}
                  >
                    {readonly ? null : (
                      <View style={{ flex: 3, flexBasis: 0 }}>
                        <View style={{ flexGrow: 1, height: 400 }}>
                          <ProductsList
                            data={normalizeProductsList(
                              products.data,
                              selectedProducts,
                              productTerritoryAllocationRecords.data
                            )}
                            refreshing={products.loading}
                            onRefresh={productsActions.handleFetch}
                            onItemPress={onAddClick}
                            showHeader
                          />
                        </View>
                      </View>
                    )}
                    <View style={{ flex: 9, flexBasis: 0 }}>
                      <View style={{ flexGrow: 1, height: 400 }}>
                        <ProductsTable
                          {...props}
                          rows={props.form.values.products}
                          removeRow={onRemoveClick}
                          showProductAllocationRemaining={
                            sampleOrderConfig.showProductAllocationRemaining &&
                            sampleOrderConfig.enableProductAllocation
                          }
                          readonly={readonly}
                        />
                      </View>
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

export default SampleOrder;
