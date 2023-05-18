import React, { Fragment } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Platform, useColorScheme } from 'react-native';
import { Button, ActivityIndicator, Banner, Select, DefaultTheme, DarkTheme, withTheme } from 'apollo-react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Workplace from './components/Workplace';
import Activity from './components/Activity';

import { mapCountries, mapWorkplaceFormValues, groupBy, mapPicklist, mapActivityFormValues, submitOneKeyRequest } from "./utils/utils";
import * as Yup from 'yup';

import { databaseManager, environment, sfNetAPI } from "oce-apps-bridges";

class OneKeyValidationRequest extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        requiredFields: [],
        error: null,
        // mappings: [],
        entityType: null,
        isLoading: false,
        loadingMessage: '',
        countries: [],
        entityTypes: [],
        workplaces: [],
        picklists: {
          workplaceTypes: [{label: '', value: ''}],
          workplaceCategories: [{label: '', value: ''}],
          individualList: [],
          courtesyTitles: [],
          individualTitles: [],
          genderList: [],
          professionalTypes: [],
          roles: [],
          specialties: [],
          individualTypeCodes: []
        },
        showRequestSubmittedMessage: false,
        showRequestErrordMessage: false,
    };
  }

  async componentDidMount() {
    try{
      const entityTypes = this.getEntityTypes();
      // const mappings = await this.getMappings();
      const countries = await this.getCountries();

      this.setState({
          ...this.state,
          mappings: [],
          countries,
          entityTypes,
      });

    }catch(error) {
      this.setState(() => {
          return {
            ...this.state,
            error,
            isLoading: false
          };
      });
      console.log(error);
    }
  }

  getInitialValues = (initialData) => {
    return {
      entityType: null,
      address: {
        country: '',
        longLabel: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__AddressLine1__c'] : '',
        city: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__City__c'] : '',
        longPostalCode: initialData ? initialData['OCE__PrimaryAccountAddress__r.OCE__ZipCode__c'] : '',
        countyCode: '',
      },
      workplace: {
        workplaceEid: '',
        usualName: initialData ? initialData.Name : '',
        parentUsualName: '',
        telephone: initialData ? initialData.Phone : '',
        typeCode: null,
        requestComments: '',
        category: null, //?
        statusCode: '', // ?
        activityLocationCode: '', //
      },
      activity: {
        activityEid: '',
        statusCode: '', //?
        telephone: '',
        role: '',
      },
      individual: {
        individualEid: '',
        firstName: initialData ? initialData.FirstName : '',
        middleName: initialData ? initialData.MiddleName : '',
        lastName: initialData ? initialData.LastName : '',
        typeCode: '',
        speciality1: '',
        speciality2: '',
        speciality3: '',
        statusCode: '',
        genderCode: '',
        prefixNameCode: '',
        titleCode: '',
      },
    }
  }

  getCountries = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true,
        loadingMessage: 'Fetching countries...'
      });
      const countriesLabels = await this.fetchCountriesLabels();
      const countriesValues = await this.fetchCountriesValues();

      this.setState({
        ...this.state,
        isLoading: false,
        loadingMessage: ''
      });

      return mapCountries(countriesValues, countriesLabels);

    }catch(error) {
      this.setState({
        ...this.state,
        isLoading: false,
        loadingMessage: ''
      });
      console.log(error);
      throw error;
    }
  }

  fetchCountriesLabels = () => {
    return sfNetAPI.describe("User")
      .then(data => {
        let availableCountriesMetadata, availableCountriesLabels;
        if (data) {
          availableCountriesMetadata = data.fields.find( field => {
            return field.name === "QIDC__OK_Available_Countries_ims__c"
          });
          availableCountriesLabels = availableCountriesMetadata ? availableCountriesMetadata.picklistValues : [];
        }
        return availableCountriesLabels;
      });
  }

  fetchCountriesValues = () => {
    const userID = environment.userID();

    return databaseManager
      .fetch(`SELECT QIDC__OK_Available_Countries_ims__c FROM USER WHERE ID = '${userID}'`)
  }

  getORByField = (filterField, filterValues) => filterValues.map(val => `${filterField} = '${val}'`).join(' OR ');

  getPicklistValues = (countryIsoCode) => {
    const picklistsTypesFilter = this.getORByField('QIDC__LIS_Code_ims__c', ['TET', 'LEX', 'TIH', 'SP', 'TYP', 'TIT', 'GEN', 'APP']);
    const filter = `Where (${picklistsTypesFilter}) And QIDC__Country_ims__c = '${countryIsoCode}'`;

    this.setState(() => {
        return {
          ...this.state,
          isLoading: true,
          loadingMessage: "Fetching picklists...",
        };
    });
    return sfNetAPI.query(`Select Id, Name, QIDC__Label_ims__c, QIDC__LIS_Code_ims__c From QIDC__OK_Code_ims__c ${filter}`)
      .then(data => {
        const groupByPicklistCode = groupBy('QIDC__LIS_Code_ims__c');
        let picklistsByCode = groupByPicklistCode(data.records);
        let picklistByName = {
          workplaceTypes: mapPicklist(picklistsByCode['TET']),
          workplaceCategories: mapPicklist(picklistsByCode['LEX']),
          roles: mapPicklist(picklistsByCode['TIH']),
          specialties: mapPicklist(picklistsByCode['SP']),
          professionalTypes: mapPicklist(picklistsByCode['TYP']),
          individualTitles: mapPicklist(picklistsByCode['TIT']),
          genderList: mapPicklist(picklistsByCode['GEN']),
          courtesyTitles: mapPicklist(picklistsByCode['APP']),
          // counties: mapPicklist(picklistsByCode['SUB.3']),
        }
        this.setState(() => {
          return {
            ...this.state,
            isLoading: false,
            loadingMessage: "",
          };
        });
        return picklistByName;
      })
      .catch(error => {
        this.setState(() => {
          return {
            ...this.state,
            isLoading: false,
            loadingMessage: "",
          };
        });
        console.log(error);
        return Promise.reject([]);
      });
  }

  getEntityTypes = () => {
    return [
        { label: 'Workplace', value: 'Workplace' },
        { label: 'Activity', value: 'Activity' },
    ]
  }

  getRequiredFields = async (entityType, countryIsoCode) => {
    const sField = entityType === 'Workplace' ? 'QIDC__Workplace_Required_Fields_ims__c' : 'QIDC__Activity_Required_Fields_ims__c';
    this.setState(() => {
        return {
          ...this.state,
          isLoading: true,
          loadingMessage: "Fetching required fields...",
        };
    });

    return sfNetAPI.query(`SELECT ${sField} FROM QIDC__Validation_Request_Required_Fields_ims__c WHERE QIDC__Country_ISO_Code_ims__c = '${countryIsoCode}'`)
      .then(data => {
        let requiredFields = [];

        if (data.records.length) {
          requiredFields = data.records.map(field => {
            return field[sField].split(';');
          })[0];
        }
        this.setState(() => {
          return {
            ...this.state,
            isLoading: false,
            loadingMessage: "",
          };
        });

        return requiredFields;
      })
      .catch(error => {
        this.setState(() => {
          return {
            ...this.state,
            isLoading: false,
            loadingMessage: "",
          };
        });
        console.log(error);
        return Promise.reject(error);
      });
  }

  handleSubmit = async (values, { setSubmitting }) => {
    const userID = environment.userID();
    const { navigate } = this.props.navigation;
    let workplaceData;

    if (values.entityType?.value === "Workplace" ) {
      workplaceData = mapWorkplaceFormValues(values, userID);
    } else if (values.entityType?.value === "Activity") {
      workplaceData = mapActivityFormValues(values, userID);
    }

    try {
      this.setState(() => {
          return {
            ...this.state,
            isLoading: true,
            loadingMessage: "Submitting request...",
          };
      });

      let responseOneKey = await submitOneKeyRequest(workplaceData);
      this.setState(() => {
          return {
            ...this.state,
            isLoading: false,
            loadingMessage: "",
          };
      });

      if (responseOneKey.ok){
        this.setState({showRequestSubmittedMessage: true});
        setTimeout(()=>{this.setState({showRequestSubmittedMessage: false}, () => navigate('AccountsList'))}, 2000);
      }else{
        this.setState({showRequestErrorMessage: true});
        setTimeout(()=>{this.setState({showRequestErrorMessage: false})}, 2000);
      }

      setSubmitting(false);
      return responseOneKey;
    } catch (error) {
      this.setState(() => {
        return {
          ...this.state,
          isLoading: false,
          loadingMessage: "",
        };
      });
      this.setState({showRequestErrorMessage: true});
      setTimeout(()=>{this.setState({showRequestErrorMessage: false})}, 2000);
      setSubmitting(false);
      return error;
    }
  }

  handleCountryClose = async (formValues) => {
    try {
      const countryISO = formValues.address.country;
      let requiredFields = [];
      if (!countryISO || !countryISO.length) {
        return false;
      }

      if (formValues.entityType) {
        requiredFields = await this.getRequiredFields(formValues.entityType, countryISO);
      }

      const picklists = await this.getPicklistValues(countryISO);

      this.setState(() => {
          return {
            ...this.state,
            picklists: {
              ...this.state.picklists,
              ...picklists
            },
            requiredFields,
          };
      });
    } catch (error) {
      console.log(error);
    }

  }

  handleEntityTypeClose = async (formValues, isValid) => {
    try {
      const countryISO = formValues.address.country?.value;
      let requiredFields = [];

      if (!countryISO || !countryISO.length) {
        return false;
      }
      if (formValues.entityType) {
        requiredFields = await this.getRequiredFields(formValues.entityType, countryISO);
      }

      this.setState(() => {
          return {
            ...this.state,
            requiredFields,
            isLoading: false,
            loadingMessage: "",
          };
      });
    } catch (error) {
      console.log(error);
    }
  }

  getValidationSchema = () => {
    const { requiredFields } = this.state;

    return Yup.object().shape({
        address: Yup.object().shape({
          country: Yup.object().shape({
            value: Yup
            .string()
            .nullable()
            .required('Required'),
          })
          .nullable(),
          city: Yup
            .string()
            .nullable()
            .required('Required'),
          longLabel: Yup.string().nullable().test('required', 'Required', (value) => {
            const isRequired = requiredFields.find((f) => f === 'Address_Line_1_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          longPostalCode: Yup.string().nullable().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Postal_Code_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
        }),
        workplace: Yup.object().shape({
          usualName: Yup.string().nullable().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Name_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          parentUsualName: Yup.string().nullable().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Organization_Name_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          telephone: Yup.string().nullable().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Telephone_No_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          typeCode: Yup.object().shape({
            value: Yup
              .string(),
          }).test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Workplace_Type_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          category: Yup.object().shape({
            value: Yup
              .string(),
          }).test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Category_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
        }),
        individual: Yup.object().shape({
          firstName: Yup.string().nullable().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'First_Name_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          middleName: Yup.string().nullable().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Middle_Name_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          lastName: Yup.string().nullable().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Last_Name_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
        }),
      })
  }

  render() {
    const { picklists, isLoading, loadingMessage, requiredFields, showRequestSubmittedMessage,
      showRequestErrorMessage, countries, entityTypes } = this.state;

    const { theme, preferredTheme, route } = this.props;
    const initialData = route.params?.itemData;

    styles.labelText = {
      ...styles.labelText,
      color: theme.colors.text
    }

    return (
      <View theme={preferredTheme} style={{flex: 1}}>
        {
          showRequestSubmittedMessage ?
            <Banner
              closeIcon
              visible={true}
              icon={'checkbox-marked-circle'}
              variant={'success'}
            >
              Validation request submitted
            </Banner> : null
        }
        {
          showRequestErrorMessage ?
            <Banner
              closeIcon
              visible={true}
              variant={'error'}
              icon={'alert-circle'}
            >
              Something went wrong
            </Banner> : null
        }
        <KeyboardAwareScrollView
          extraScrollHeight={50}
          style={{ backgroundColor: theme.colors.background }}
        >
          <SafeAreaView>
            <Formik
              initialValues={this.getInitialValues(initialData)}
              validationSchema={this.getValidationSchema()}
              onSubmit={(values, actions) => {
                this.handleSubmit(values, actions)
              }}
              enableReinitialize
            >
              {({
                handleChange,
                values,
                handleSubmit,
                errors,
                isValid,
                touched,
                handleBlur,
                isSubmitting,
                resetForm,
                setFieldValue,
                validate
              }) => (
                <View style={[styles.container,]}>
                  <View style={styles.formSection}>
                    <View style={styles.formSectionRow}>
                      <View style={styles.formInput}>
                        <Text style={styles.label}>
                          <Text style={styles.labelText}>Record Type</Text>
                        </Text>
                        <Select
                            onChange={(val) => {
                              handleChange('entityType')(val);
                              this.handleEntityTypeClose(values, errors)
                            }}
                            options={entityTypes}
                            placeholder={'Choose a Record Type'}
                            value={values.entityType}
                            fullWidth
                        />
                      </View>
                      <View style={styles.formInput}>
                        {
                          values.entityType !== null ?
                          <View>
                            <View style={styles.label}>
                              <Text style={styles.labelText}>Country</Text>
                              <Text style={styles.labelRequired}>*</Text>
                            </View>
                            <Select
                              onChange={(val) => {
                                handleChange('address.country')(val);
                                this.handleCountryClose(values)
                              }}
                              options={countries}
                              placeholder={'Choose a Country'}
                              value={values.address.country}
                              fullWidth
                            />
                          </View> : null
                        }
                      </View>
                    </View>
                  </View>
                  {
                    values.entityType?.value === "Workplace" ?
                      <Workplace
                        formData={{workplace: values.workplace, address: values.address}}
                        picklists={picklists}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        requiredFields={requiredFields}
                        setFieldValue={setFieldValue}
                      />
                    : null
                  }
                  {
                    values.entityType?.value === "Activity" ?
                      <Fragment>
                        <Activity
                          formData={{workplace: values.workplace, address: values.address, individual: values.individual, activity: values.activity}}
                          picklists={picklists}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          requiredFields={requiredFields}
                          setFieldValue={setFieldValue}
                        />
                        <Workplace
                          formData={{workplace: values.workplace, address: values.address}}
                          picklists={picklists}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          requiredFields={requiredFields}
                          setFieldValue={setFieldValue}
                        />
                      </Fragment>
                      : null
                  }
                  {
                    values.entityType !== null ?
                    <View style={styles.buttonContainer}>
                      <Button
                        buttonType='outline'
                        onPress={handleSubmit}
                        buttonColor='#039BE5'
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                      >Submit</Button>
                    </View>
                    : null
                  }
                </View>
              )}

            </Formik>

            {isLoading ?
              <View style={[styles.loader, { backgroundColor: theme.dark ? theme.colors.background : "rgba(255,255,255,0.7)"}]}>
                <ActivityIndicator animating={true} color={theme.colors.primary}/>
                <Text style={[styles.loaderText, {color: theme.dark ? theme.colors.text : "#7c7f81"}]}>{loadingMessage}</Text>
              </View> : null
            }

          </SafeAreaView>
        </KeyboardAwareScrollView>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  formSection: {
    padding: 10,
    marginBottom: 10
  },
  formSectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  formSectionTitle: {
    padding: 10,
    backgroundColor: "#f4f6f9",
    marginBottom: 10
  },
  formSectionTitleText: {
    color: "#7c7f81",
  },
  formInput: {
    width: "40%",
  },
  buttonContainer: {
    margin: 25
  },
  selectInput: {
    height: 36,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#FFFFFF'
  },
  selectLabel: {
    marginBottom: 8
  },
  label: {
    flexDirection: "row",
    marginBottom: 8,
  },
  labelText: {
    marginRight: 3,
  },
  labelRequired: {
    color: "#D60000"
  },
  loader: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    zIndex: 100,
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
  },
  loaderText: {
    fontSize: 15,
    paddingTop: 20,
    position: "absolute",
    top: "50%",
  }
})

const withPreferredTheme = (Component) => {
  return (props) => {
    let preferredTheme = DefaultTheme;
    if (Platform.OS !== 'web') {
        const colorScheme = useColorScheme();
        preferredTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
    }
    return <Component preferredTheme={preferredTheme} {...props} />;
  };
};

const OneKeyValidationRequestContainer = withTheme(withPreferredTheme(OneKeyValidationRequest));

export default OneKeyValidationRequestContainer;
