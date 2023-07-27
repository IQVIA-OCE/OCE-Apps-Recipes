import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, FieldArray } from 'formik';
import { useFetcher, useBanner } from '../../hooks';
import { AppContext } from '../../AppContext';
import { environment } from 'oce-apps-bridges';
import {
  normalizeProductsList,
  mapTransactionDetails,
  mapTransactionProducts,
  mapFormDetails,
  createTransactionProduct,
} from './utils';
import { getValidationSchema } from './validationSchema';
import initialFormValues from './initialFormValues';

import {
  fetchSampleProducts,
  fetchTransactionDetails,
  fetchTransactionProducts,
  deleteFormProduct,
  deleteTransaction,
  saveTransactionAsDuplicate,
  saveTransaction,
} from '../../api/SampleTransaction';

import { Banner, themeGrey, useTheme } from 'apollo-react-native';
import FormHeader from '../../components/FormHeader/FormHeader';
import FormPanel from './FormPanel/FormPanel';
import TransactionTable from './TransactionTable/TransactionTable';
import ProductsList from '../../components/ProductsList/ProductsList';
import Loader from '../../components/Loader/Loader';
import DuplicateModal from './DuplicateModal';
import ReturnToSenderModal from './ReturnToSenderModal';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';

const SampleTransaction = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const [
    {
      submitting,
      disabledButtons,
      formSubmitType,
      selectedProducts,
      readonly,
      recordType,
      duplicateModalStatus,
      returnToSenderModalStatus,
      transactionId,
      isPreviewPrevScreen,
      newTransactionDateTime,
    },
    setValue,
  ] = useState({
    submitting: false,
    disabledButtons: false,
    formSubmitType: 'Save',
    selectedProducts: [],
    readonly: route.params?.readonly || false,
    recordType: route.params?.recordType || null,
    transactionId: route.params?.id || null,
    duplicateModalStatus: '',
    returnToSenderModalStatus: '',
    isPreviewPrevScreen: !!route.params?.readonly,
    newTransactionDateTime: new Date(),
  });

  const { username } = useContext(AppContext);
  const userId = environment.userID();
  const user = {
    Name: username,
    Id: userId,
  };

  const [products, productsActions] = useFetcher(() =>
    fetchSampleProducts(recordType.DeveloperName)
  );

  const [banner, setBanner] = useBanner();

  const [transactionDetails] = useFetcher(
    () => fetchTransactionDetails(transactionId),
    mapTransactionDetails
  );

  const [transactionProducts] = useFetcher(
    () => fetchTransactionProducts(transactionId),
    mapTransactionProducts
  );

  useEffect(() => {
    if (transactionProducts.data != null) {
      const normalizedSelectedProducts = transactionProducts.data.map(
        product => {
          return {
            label: product.label,
            detailLabel: product.detailLabel,
            lotId: product.lotNumberId,
            id: product.sampleProductId,
          };
        }
      );

      setValue(prevState => ({
        ...prevState,
        selectedProducts: normalizedSelectedProducts,
      }));
    }
  }, [transactionProducts, readonly]);

  const getDeletedDetailRecords = values => {
    const deletedDetailRecords = transactionProducts.data
      ? transactionProducts.data.filter(initialProduct => {
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

  const saveFormData = async values => {
    setValue(prevState => ({ ...prevState, submitting: true }));
    try {
      const deletedDetailRecords = getDeletedDetailRecords(values);
      const detailRecords = JSON.stringify([
        ...values.products.map(prod => {
          return {
            ...prod,
            reason: prod.reason && prod.reason.id ? prod.reason.label : null,
          };
        }),
        ...deletedDetailRecords.map(prod => {
          return {
            ...prod,
            reason: prod.reason && prod.reason.id ? prod.reason.label : null,
          };
        }),
      ]);

      const record = JSON.stringify({
        ...mapFormDetails(values),
        Id: transactionId,
        OCE__Status__c:
          formSubmitType == 'submit' ? 'Submitted' : 'In Progress',
      });

      await saveTransaction({
        record,
        detailRecords,
        transactionId: '',
        returnToSenderDetails: '',
        requestType: '',
      });

      setBanner({
        variant: 'success',
        message: `Successfully ${
          formSubmitType == 'submit' ? 'submitted' : 'saved'
        }`,
        visible: true,
        icon: 'checkbox-marked-circle',
      });

      setValue(prevState => ({
        ...prevState,
        submitting: false,
        disabledButtons: true,
      }));

      setTimeout(() => {
        navigation.navigate('Dashboard', {refreshSamplesTimelineWidget: true, refreshReceivedTimelineWidget: true});
      }, 3000);
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
          selectedProduct.id === product.sampleProductId &&
          selectedProduct.lotId === product.lotNumberId
        );
      }),
    }));
  };

  const getInitialData = transactionId => {
    if (transactionId) {
      return {
        fields: {
          ...transactionDetails.data,
          user,
          transactionRep: user,
        },
        products: transactionProducts.data || [],
        recordType: recordType,
      };
    }

    return getNewTransactionData();
  };

  const getNewTransactionData = () => {
    return {
      fields: {
        ...initialFormValues[recordType.DeveloperName],
        user,
        transactionRep: user,
        transactionDateTime: newTransactionDateTime,
      },
      products: [],
      recordType: recordType,
    };
  };

  const deleteTransactionWithDetails = async (id, values) => {
    setValue(prevState => ({ ...prevState, submitting: true }));

    try {
      const formProductPromises = values.products.map(async product => {
        return deleteFormProduct(product.id);
      });

      await Promise.all(formProductPromises);
      await deleteTransaction(id);

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
        navigation.navigate('Dashboard', { refreshSamplesTimelineWidget: true, refreshReceivedTimelineWidget: true });
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

  const getFormControls = (
    values,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    resetForm
  ) => {
    if (readonly) {
      if (values.fields.status == 'In Progress') {
        if (values.fields.isSystemCreated) {
          return [
            {
              label: 'Back',
              onPress: () => navigation.navigate('Dashboard'),
              disabled: isSubmitting || disabledButtons,
            },
            {
              label: 'Duplicate',
              mode: 'contained',
              color: 'primary',
              onPress: () =>
                setValue(prevState => ({
                  ...prevState,
                  duplicateModalStatus: 'open',
                })),
              disabled: isSubmitting || disabledButtons,
            },
            {
              label: 'Return To Sender',
              color: 'primary',
              mode: 'contained',
              onPress: () =>
                setValue(prevState => ({
                  ...prevState,
                  returnToSenderModalStatus: 'open',
                })),
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
          ];
        }
        return [
          {
            label: 'Back',
            onPress: () => navigation.navigate('Dashboard'),
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
            onPress: () => deleteTransactionWithDetails(transactionId, values),
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
        ];
      }
    } else {
      return [
        {
          label: 'Cancel',
          onPress: () => {
            if (isPreviewPrevScreen) {
              setValue(prevState => ({
                ...prevState,
                readonly: true,
              }));
              resetForm();
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

  const markTransactionAsDuplicate = async values => {
    try {
      setValue(prevState => ({
        ...prevState,
        duplicateModalStatus: '',
        disabledButtons: true,
        submitting: true,
      }));

      await saveTransactionAsDuplicate(transactionId, values);

      setValue(prevState => ({
        ...prevState,
        submitting: false,
      }));

      setBanner({
        variant: 'success',
        message: `Successfully updated`,
        visible: true,
        icon: 'checkbox-marked-circle',
      });

      setTimeout(() => {
        navigation.navigate('Dashboard', { refreshSamplesTimelineWidget: true, refreshReceivedTimelineWidget: true });
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

  const returnToSenderTransaction = async (values, returnValues) => {
    try {
      setValue(prevState => ({
        ...prevState,
        returnToSenderModalStatus: '',
        disabledButtons: true,
        submitting: true,
      }));

      const returnToSenderDetails = JSON.stringify({
        carrier: values.fields.shipmentCarrier,
        shipDate: moment(values.fields.shipmentDate).format('YYYY-MM-DD'),
        comments: values.fields.comments,
        trackingNumber: values.fields.trackingNumber,
        returnToSendershipTo: values.fields.shipTo.id,
      });

      await saveTransaction({
        record: '{}',
        transactionId: transactionId,
        returnToSenderDetails: returnToSenderDetails,
        requestType: 'Return',
        detailRecords: '[]',
      });

      setValue(prevState => ({
        ...prevState,
        submitting: false,
      }));

      setBanner({
        variant: 'success',
        message: `Successfully updated`,
        visible: true,
        icon: 'checkbox-marked-circle',
      });

      setTimeout(() => {
        navigation.navigate('Dashboard', { refreshSamplesTimelineWidget: true, refreshReceivedTimelineWidget: true });
      }, 3000);
    } catch (error) {
      setValue(prevState => ({
        ...prevState,
        submitting: false,
        disabledButtons: false,
      }));
      setBanner({
        variant: 'error',
        message: error.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      scrollEnabled={true}
      automaticallyAdjustContentInsets={false}
      keyboardShouldPersistTaps="always"
      scrollEventThrottle={10}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: theme.colors.background, height:  Platform.OS === 'web' ? 600 : '100%' }}

    >
      <Formik
        enableReinitialize
        initialValues={getInitialData(transactionId)}
        onSubmit={saveFormData}
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
          resetForm,
        }) => (
          <>
            {submitting ||
            transactionProducts.loading ||
            transactionDetails.loading ? (
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
                label={recordType.Name}
                title={
                  transactionId && transactionDetails.data
                    ? transactionDetails.data.name
                    : 'New Sample Transaction'
                }
                controls={getFormControls(
                  values,
                  isSubmitting,
                  setFieldValue,
                  handleSubmit,
                  resetForm
                )}
              />
              {transactionDetails.loading ? null : (
                <FormPanel
                  recordType={recordType.DeveloperName}
                  readonly={readonly}
                  isLoadingDetails={transactionDetails.loading}
                />
              )}
            </View>

            <FieldArray name="products">
              {props => {
                const onAddClick = product => {
                  handleSelectProduct(product);

                  const transactionProduct = createTransactionProduct(product);

                  props.push(transactionProduct);
                };
                const onRemoveClick = productToDeselect => {
                  handleDeselectProduct(productToDeselect);

                  const filteredProducts = values.products.filter(prod => {
                    return !(
                      prod.sampleProductId ===
                        productToDeselect.sampleProductId &&
                      prod.lotNumberId === productToDeselect.lotNumberId
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
                      <View style={{ flex: 3 }}>
                        <View style={{ flexGrow: 1, height: 400 }}>
                          <ProductsList
                            data={normalizeProductsList(
                              products.data,
                              recordType.DeveloperName,
                              selectedProducts
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
                        <TransactionTable
                          {...props}
                          rows={props.form.values.products}
                          removeRow={onRemoveClick}
                          readonly={readonly}
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            </FieldArray>
            <DuplicateModal
              handleAction={markTransactionAsDuplicate}
              status={duplicateModalStatus}
              onDismiss={() =>
                setValue(prevState => ({
                  ...prevState,
                  duplicateModalStatus: '',
                }))
              }
            />
            <ReturnToSenderModal
              handleAction={returnToSenderTransaction}
              status={returnToSenderModalStatus}
              onDismiss={() =>
                setValue(prevState => ({
                  ...prevState,
                  returnToSenderModalStatus: '',
                }))
              }
              fromSalesRep={values.fields.fromSalesRep}
              returnValues={values}
            />
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 10,
    flexDirection: 'row',
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
