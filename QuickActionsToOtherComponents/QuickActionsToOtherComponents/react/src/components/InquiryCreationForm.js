import {
  Button,
  Checkbox,
  Modal,
  Portal,
  Select,
  Switch,
  TextInput,
  Title,
  useTheme,
} from '@oce-apps/apollo-react-native';
import color from 'color';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { isIphone, isWeb } from '../utils';
import { CustomProgress } from './CustomProgress';

const RESPONSE_PREFERENCE = {
  EMAIL: 'Email',
  FAX: 'Fax',
  PHONE: 'Phone',
};

const FIELDS = {
  ACCOUNT: 'account',
  PRIORITY: 'priority',
  INQUIRY_TYPE: 'inquiryType',
  INQUIRY_CHANEL: 'inquiryChanel',
  CALL: 'call',
  RESPONSE_PREFERENCE: 'responsePreference',
  RESPONSE_CONTACT: 'responseContact',
  SPECIAL_HANDLING_INSTRUCTION: 'specialHandlingInstruction',
};

const VALIDATORS = {
  [RESPONSE_PREFERENCE.EMAIL]: (str) =>
    new RegExp(
      /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
    ).test(str),
  [RESPONSE_PREFERENCE.FAX]: (str) => new RegExp(/^\d{10}$/).test(str),
  [RESPONSE_PREFERENCE.PHONE]: (str) => new RegExp(/^\d{10}$/).test(str),
};

const ERROR_TEXT = {
  EMPTY: 'Cannot be empty',
  [RESPONSE_PREFERENCE.EMAIL]: 'Incorrect email',
  [RESPONSE_PREFERENCE.FAX]: 'Incorrect fax number',
  [RESPONSE_PREFERENCE.PHONE]: 'Incorrect phone number',
};

const responsePreferences = [
  {
    label: RESPONSE_PREFERENCE.EMAIL,
    value: RESPONSE_PREFERENCE.EMAIL,
  },
  {
    label: RESPONSE_PREFERENCE.FAX,
    value: RESPONSE_PREFERENCE.FAX,
  },
  {
    label: RESPONSE_PREFERENCE.PHONE,
    value: RESPONSE_PREFERENCE.PHONE,
  },
];

const initialFormState = {
  account: {
    value: null,
    required: true,
    errorText: null,
  },
  priority: {
    value: false,
    required: false,
    errorText: null,
  },
  status: {
    value: { label: 'Draft', value: 'Draft' },
    required: false,
    errorText: null,
  },
  inquiryType: {
    value: null,
    required: false,
    errorText: null,
  },
  inquiryChanel: {
    value: null,
    required: false,
    errorText: null,
  },
  call: {
    value: '',
    required: true,
    errorText: null,
  },
  isSignatureCopyRequested: {
    value: false,
    required: false,
    errorText: null,
  },
  responsePreference: {
    value: null,
    required: true,
    errorText: null,
  },
  responseContact: {
    value: '',
    required: true,
    errorText: null,
  },
  specialHandlingInstruction: {
    value: '',
    required: false,
    errorText: null,
  },
};

const FORM_HEIGHT_FOR_WEB = {
  detailsBlock: 290,
  responseBlock: 200,
};

export const InquiryCreationForm = ({
  visible,
  handleCancel,
  handleSave,
  account,
  accountsList,
  call,
  inquiryTypes,
  inquiryChannels,
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState(initialFormState);
  const titleBGColor = theme.dark
    ? color(theme.colors.surface).lighten(0.3).string()
    : color(theme.colors.surface).darken(0.1).string();
  const formBlockStyles = isIphone
    ? styles.formBlockPhone
    : styles.formBlockPad;

  useEffect(() => {
    initialSetting();
  }, []);

  const initialSetting = () => {
    setFormData((prevState) => ({
      ...prevState,
      account: {
        ...prevState.account,
        value: account,
      },
      call: {
        ...prevState.call,
        value: call.name,
      },
    }));
  };

  const onChangeHandler = (field, value) => {
    let errorText = null;

    if (formData[field].required) {
      errorText = !Boolean(value) ? ERROR_TEXT.EMPTY : null;

      if (field === FIELDS.RESPONSE_CONTACT && !errorText) {
        const responsePreference = formData.responsePreference.value?.value;
        errorText = !VALIDATORS[responsePreference](value)
          ? ERROR_TEXT[responsePreference]
          : null;
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value: value,
        errorText: errorText,
      },
    }));
  };

  const onBlurHandler = (field) => {
    const errorText = !Boolean(formData[field].value) ? ERROR_TEXT.EMPTY : null;

    setFormData((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        errorText: prevState[field].errorText || errorText,
      },
    }));
  };

  const isFormValid = () => {
    const invalidFields = Object.keys(formData).filter(
      (field) =>
        formData[field].required &&
        (!formData[field].value || formData[field].errorText)
    );

    if (invalidFields.length) {
      invalidFields.forEach((field) => {
        if (field === FIELDS.RESPONSE_PREFERENCE) {
          onChangeHandler(field, formData[field].value);
        } else {
          onBlurHandler(field);
        }
        return false;
      });
    } else {
      return true;
    }
  };

  const getFieldsValues = () => ({
    account: formData.account.value?.value,
    priority: formData.priority.value,
    status: formData.priority.value.value,
    inquiryType: formData.inquiryType.value?.value,
    inquiryChanel: formData.inquiryChanel.value?.value,
    call: call.id,
    isSignatureCopyRequested: formData.isSignatureCopyRequested.value,
    responsePreference: formData.responsePreference.value?.value,
    email:
      formData.responsePreference.value?.value === RESPONSE_PREFERENCE.EMAIL
        ? formData.responseContact.value
        : null,
    fax:
      formData.responsePreference.value?.value === RESPONSE_PREFERENCE.FAX
        ? formData.responseContact.value
        : null,
    phone:
      formData.responsePreference.value?.value === RESPONSE_PREFERENCE.PHONE
        ? formData.responseContact.value
        : null,
    specialHandlingInstruction: formData.specialHandlingInstruction.value,
  });

  const cancelButtonHandler = () => {
    handleCancel();
    setFormData(initialFormState);
    initialSetting();
  };

  const saveButtonHandler = () => {
    if (isFormValid()) {
      handleSave(getFieldsValues());
      setFormData(initialFormState);
      initialSetting();
    }
  };

  const isAccountEmpty =
    formData.account.value === null && accountsList.length === 1;
  if (isAccountEmpty) {
    return <CustomProgress />;
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={styles.modal}
      >
        <Modal.Title
          title="New Inquiry"
          titleStyle={styles.modalTitle}
          closeIcon={false}
        />
        <Modal.Content>
          <ScrollView>
            <View>
              <View
                style={[
                  styles.titleContainer,
                  { backgroundColor: titleBGColor },
                ]}
              >
                <Title>Inquiry Details</Title>
              </View>
              <View
                style={[
                  formBlockStyles,
                  isWeb && { height: FORM_HEIGHT_FOR_WEB.detailsBlock },
                ]}
              >
                <View
                  style={
                    isIphone ? styles.formColumnPhone : styles.formColumnPad
                  }
                >
                  <View style={styles.formItem}>
                    <Select
                      label="Account"
                      placeholder="None"
                      options={accountsList}
                      value={formData.account.value}
                      onChange={(val) => onChangeHandler(FIELDS.ACCOUNT, val)}
                      required={formData.account.required}
                      helperText={formData.account.errorText}
                      error={formData.account.errorText}
                      asteriskPosition="after"
                      fullWidth
                    />
                  </View>
                  <View style={styles.formItem}>
                    <Switch
                      label="Priority"
                      value={formData.priority.value}
                      onChange={() =>
                        onChangeHandler(
                          FIELDS.PRIORITY,
                          !formData.priority.value
                        )
                      }
                    />
                  </View>
                  <View style={styles.formItem}>
                    <Select
                      label="Status"
                      placeholder="None"
                      value={formData.status.value}
                      disabled
                      fullWidth
                    />
                  </View>
                </View>
                <View
                  style={
                    isIphone ? styles.formColumnPhone : styles.formColumnPad
                  }
                >
                  <View style={styles.formItem}>
                    <Select
                      label="Inquiry Type"
                      placeholder="None"
                      options={inquiryTypes}
                      value={formData.inquiryType.value}
                      onChange={(val) =>
                        onChangeHandler(FIELDS.INQUIRY_TYPE, val)
                      }
                      required={formData.inquiryType.required}
                      fullWidth
                    />
                  </View>
                  <View style={styles.formItem}>
                    <Select
                      label="Inquiry Chanel"
                      placeholder="None"
                      options={inquiryChannels}
                      value={formData.inquiryChanel.value}
                      onChange={(val) =>
                        onChangeHandler(FIELDS.INQUIRY_CHANEL, val)
                      }
                      required={formData.inquiryChanel.required}
                      fullWidth
                    />
                  </View>
                  <View style={styles.formItem}>
                    <TextInput
                      label="Call"
                      value={formData.call.value}
                      required={formData.call.required}
                      asteriskPosition="after"
                      fullWidth
                      readonly
                    />
                  </View>
                  <View style={styles.formItem}>
                    <Checkbox
                      label="Is Signature Copy Requested"
                      checked={formData.isSignatureCopyRequested.value}
                      disabled
                    />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View
                style={[
                  styles.titleContainer,
                  { backgroundColor: titleBGColor },
                ]}
              >
                <Title>Response</Title>
              </View>
              <View
                style={[
                  formBlockStyles,
                  isWeb && { height: FORM_HEIGHT_FOR_WEB.responseBlock },
                ]}
              >
                <View
                  style={
                    isIphone ? styles.formColumnPhone : styles.formColumnPad
                  }
                >
                  <View style={styles.formItem}>
                    <Select
                      label="Response Preference"
                      placeholder="None"
                      helperText={formData.responsePreference.errorText}
                      error={formData.responsePreference.errorText}
                      options={responsePreferences}
                      value={formData.responsePreference.value}
                      onChange={(val) => {
                        onChangeHandler(FIELDS.RESPONSE_PREFERENCE, val);
                        onChangeHandler(FIELDS.RESPONSE_CONTACT, '');
                      }}
                      required={formData.responsePreference.required}
                      asteriskPosition="after"
                      fullWidth
                    />
                  </View>
                  <View style={styles.formItem}>
                    {formData.responsePreference.value && (
                      <TextInput
                        helperText={formData.responseContact.errorText}
                        error={formData.responseContact.errorText}
                        label={formData.responsePreference.value.value}
                        value={formData.responseContact.value}
                        onChangeText={(val) =>
                          onChangeHandler(FIELDS.RESPONSE_CONTACT, val)
                        }
                        onBlur={() => onBlurHandler(FIELDS.RESPONSE_CONTACT)}
                        required={formData.responseContact.required}
                        asteriskPosition="after"
                        fullWidth
                      />
                    )}
                  </View>
                </View>
                <View
                  style={
                    isIphone ? styles.formColumnPhone : styles.formColumnPad
                  }
                >
                  <View style={styles.formItem}>
                    <TextInput
                      label="Special Handling Instruction"
                      value={formData.specialHandlingInstruction.value}
                      onChangeText={(val) =>
                        onChangeHandler(
                          FIELDS.SPECIAL_HANDLING_INSTRUCTION,
                          val
                        )
                      }
                      rows={5}
                      multiline
                      fullWidth
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal.Content>
        <Modal.Actions style={styles.buttonsContainer}>
          <Button
            style={isWeb && styles.button}
            mode="outlined"
            color="tertiary"
            onPress={cancelButtonHandler}
          >
            Cancel
          </Button>
          <Button
            style={isWeb && styles.button}
            mode="contained"
            onPress={saveButtonHandler}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '90%',
    minWidth: '90%',
  },
  modalTitle: {
    textAlign: 'center',
  },
  titleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  formBlockPad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  formBlockPhone: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  formColumnPad: {
    width: '48%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  formColumnPhone: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  formItem: {
    paddingVertical: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    cursor: 'pointer',
  },
});
