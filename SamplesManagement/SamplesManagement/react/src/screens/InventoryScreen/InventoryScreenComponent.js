import React, { useContext } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { getValidationSchema } from './validationSchema';
import Loader from '../../components/Loader/Loader';
import FormHeader from '../../components/FormHeader/FormHeader';
import FormDetails from '../../components/FormDetails/FormDetails';
import moment from 'moment';
import Status from '../../components/Status/Status';
import { FieldArray, Formik } from 'formik';
import InventoryScreen from './InventoryScreen';
import { deleteInventory, saveInventory } from '../../api/Inventories';
import { useBanner, useBoolean } from '../../hooks';
import { Banner, Paragraph, TextInput, Colors } from 'apollo-react-native';
import { AppContext } from '../../../AppContext';
import { InventoryContext } from './InventoryContext';
import {
  BANNER_CONFIG,
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_WITH_SECONDS,
  INVENTORY_STATUS,
} from './constants';
import { INVENTORY_FORM_TYPE } from '../../constants/Inventories';
import InventoryReason from './InventoryReason/InventoryReason';
import InventoryAuditor from './InventoryAuditor/InventoryAuditor';
import { checkProductsInvalid } from './utils';

const InventoryScreenComponent = ({ navigation }) => {
  const { userId, username } = useContext(AppContext);
  const {
    editingType,
    isLoading,
    lastInventoryCreatedDate,
    error,
    transactionDetails,
    config: { showCalculatedFields, showSystemCount },
    recordType,
    formInitialValues,
    actions,
  } = useContext(InventoryContext);
  const getHeaderControls = (status, handleSubmit, setFieldValue) => {
    if (editingType === INVENTORY_FORM_TYPE.preview) {
      if (status === INVENTORY_STATUS.submitted) {
        return [
          {
            label: 'Back',
            onPress: () => navigation.goBack(),
            disabled: submitting,
          },
        ];
      } else {
        return [
          {
            label: 'Back',
            onPress: () => navigation.goBack(),
            disabled: submitting,
          },
          {
            label: 'Edit',
            onPress: () => {
              navigation.replace('Inventory', {
                id: formInitialValues.id,
                type:
                  formInitialValues.status === INVENTORY_STATUS.saved
                    ? INVENTORY_FORM_TYPE.editSaved
                    : INVENTORY_FORM_TYPE.edit,
              });
            },
            disabled: submitting,
          },
          {
            label: 'Delete',
            color: 'primary',
            mode: 'contained',
            onPress: () => {
              handleDelete(navigation.state.params.id);
            },
            disabled: submitting,
          },
        ];
      }
    }
    return [
      {
        label: 'Cancel',
        onPress: () => navigation.goBack(),
      },
      {
        label: 'Save',
        disabled: submitting,
        onPress: () => {
          setFieldValue('buttonPressed', INVENTORY_STATUS.saved, false);
          handleSubmit();
        },
      },
      {
        label: 'Submit',
        color: 'primary',
        mode: 'contained',
        disabled: submitting,
        onPress: () => {
          setFieldValue('buttonPressed', INVENTORY_STATUS.submitted, false);
          handleSubmit();
        },
      },
    ];
  };
  const [submitting, submittingActions] = useBoolean(false);
  const [banner, setBanner] = useBanner();

  const handleDelete = id => {
    Alert.alert(
      '',
      'Are you sure you want to delete this Sample Inventory?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteInventory(id);
            navigation.navigate('Dashboard', { refreshInventoryWidget: true });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onSubmit = async ({ buttonPressed, ...values }, { setFieldValue }) => {
    let bannerConfig = BANNER_CONFIG.inProgress;

    if (buttonPressed === INVENTORY_STATUS.submitted) {
      bannerConfig = BANNER_CONFIG.submitted;
      values.status = INVENTORY_STATUS.submitted;

      if (
        editingType === INVENTORY_FORM_TYPE.edit &&
        showCalculatedFields &&
        !showSystemCount
      ) {
        // if contains at least one product with not valid physical quantity
        if (checkProductsInvalid(values.products)) {
          bannerConfig = BANNER_CONFIG.saved;
          values.status = INVENTORY_STATUS.saved;
        }
      }
    } else if (
      buttonPressed === INVENTORY_STATUS.saved &&
      values.status === INVENTORY_STATUS.saved
    ) {
      bannerConfig = BANNER_CONFIG.saved;
    }

    submittingActions.setTrue();

    try {
      const resp = await saveInventory(
        {
          ...values,
          userId: userId,
          dateTime: moment(values.dateTime).format('YYYY-MM-DDTHH:mm:ss'),
          recordTypeId: recordType.Id,
        },
        transactionDetails.map(el => el.Id)
      );

      if (
        editingType === INVENTORY_FORM_TYPE.edit &&
        showCalculatedFields &&
        !showSystemCount &&
        buttonPressed === INVENTORY_STATUS.submitted &&
        checkProductsInvalid(values.products)
      ) {
        setFieldValue('id', resp[0].sampleInventory.Id, false);
        setFieldValue('status', INVENTORY_STATUS.saved, false);
        setFieldValue(
          'products',
          values.products.map(el => {
            const { id } = resp[0].sampleInventoryDetails.find(
              item => item.sampleProductId === el.sampleProductId
            );
            el.id = id;
            return el;
          })
        );
        actions.handleEditingType(INVENTORY_FORM_TYPE.editSaved);
        submittingActions.setFalse();
      } else {
        setTimeout(() => {
          submittingActions.setFalse();

          navigation.navigate('Dashboard', { refreshInventoryWidget: true });
        }, 2000);
      }
      setBanner(bannerConfig);
    } catch (e) {
      submittingActions.setFalse();
      setBanner({
        variant: 'error',
        message: e.message,
        visible: true,
        icon: 'alert-circle',
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Banner variant="error" icon="error" visible>
        {error.message ? error.message : error}
      </Banner>
    );

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={onSubmit}
      validationSchema={() =>
        getValidationSchema(
          { showCalculatedFields, showSystemCount },
          {
            AdHocInventory: recordType.DeveloperName === 'AdHocInventory',
            AuditedInventory: recordType.DeveloperName === 'AuditedInventory',
          }
        )
      }
    >
      {({ handleSubmit, values, isSubmitting, setFieldValue }) => (
        <>
          <Banner
            variant={banner.variant}
            icon={banner.icon}
            visible={banner.visible}
          >
            {banner.message}
          </Banner>
          {isSubmitting && <Loader />}
          <FormHeader
            iconColor="#34becd"
            label={recordType ? recordType.Name : 'Inventory'}
            title={values.name ? values.name : 'New Sample Inventory'}
            controls={getHeaderControls(
              values.status,
              handleSubmit,
              setFieldValue
            )}
          >
            {lastInventoryCreatedDate ? (
              <View style={styles.reconciliationBlock}>
                <Text style={styles.reconciliationTitle}>
                  Last Reconciliation Date
                </Text>
                <Text>
                  {moment(lastInventoryCreatedDate).format(DATE_TIME_FORMAT)}
                </Text>
              </View>
            ) : null}
          </FormHeader>
          <View style={styles.detailsContainer}>
            <FormDetails title="Inventory Date Time">
              <Paragraph style={{ fontSize: 16 }}>
                {moment(values.datetime).format(DATE_TIME_FORMAT_WITH_SECONDS)}
              </Paragraph>
            </FormDetails>
            <FormDetails title="Status">
              <Status size="large" status={values.status} />
            </FormDetails>
            <FormDetails title="Assigned To">
              <Paragraph style={{ fontSize: 16 }}>{username}</Paragraph>
            </FormDetails>
            {recordType.DeveloperName === 'AdHocInventory' && (
              <FormDetails title="* Reason">
                <InventoryReason />
              </FormDetails>
            )}
            {recordType.DeveloperName === 'AuditedInventory' && (
              <FormDetails title="* Auditor">
                <InventoryAuditor />
              </FormDetails>
            )}
            <FormDetails title="Comments">
              <TextInput
                value={values.comments}
                onChangeText={text => setFieldValue('comments', text)}
                multiline
                rows={3}
                readonly={
                  editingType === INVENTORY_FORM_TYPE.preview ||
                  editingType === INVENTORY_FORM_TYPE.editSaved
                }
              />
            </FormDetails>
          </View>
          <FieldArray name="products">
            {props => <InventoryScreen {...props} />}
          </FieldArray>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral2,
  },
  reconciliationBlock: {
    marginRight: 20,
  },
  reconciliationTitle: {
    fontSize: 12,
    marginBottom: 3,
    color: Colors.neutral9,
  },
});

export default InventoryScreenComponent;
