import React, { Fragment } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { Button, ActivityIndicator, Colors, Banner, Appbar } from 'apollo-react-native';
import { Formik } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Workplace from './components/Workplace';
import Activity from './components/Activity';

import { dbManager } from "../../../bridge/container";
import { environment } from "../../../bridge/EnvironmentData/EnvironmentData.native";

import { sfNetAPI } from "../../../bridge/sf/sfnetapi";

import { mapCountries, mapWorkplaces, mapWorkplaceFormValues, groupBy, mapPicklist, mapActivityFormValues } from "./utils/utils";
import * as Yup from 'yup';
import {encode as btoa} from 'base-64';

export default class OneKeyValidationRequest extends React.Component {

  static title = "Create Validation Request";

  static navigationOptions = {
    title: this.title
}

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
        typeCode: '',
        requestComments: '',
        category: '', //?
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
        specialty1: '',
        specialty2: '',
        specialty3: '',
        statusCode: '',
        genderCode: '',
        prefixNameCode: '',
        titleCode: '',
      },
    }
  }

  // getMappings = async () => {
  //   try {
  //     this.setState({
  //       ...this.state,
  //       isLoading: true,
  //       loadingMessage: 'Fetching mappings...'
  //     });
  //
  //     let objectsMappings = await this.fetchObjectsMappings();
  //     let mappings = [];
  //
  //     for await (let object of objectsMappings) {
  //       const fieldMappings = await this.fetchFieldMappings(object.Id);
  //
  //       const mapping = {
  //         ...object,
  //         fieldMappings,
  //       }
  //
  //       mappings.push(mapping);
  //     }
  //
  //     this.setState({
  //       ...this.state,
  //       isLoading: false,
  //       loadingMessage: ''
  //     });
  //
  //     return mappings;
  //   }catch(error){
  //
  //     this.setState({
  //       ...this.state,
  //       isLoading: false,
  //       loadingMessage: ''
  //     });
  //
  //     console.log(error);
  //     return([])
  //   }
  // }

  // fetchObjectsMappings = () => {
  //   return new Promise((resolve, reject) => {
  //     sfNetAPI
  //       .query(`SELECT Id, QIDC__OneKey_Entity_ims__c, QIDC__SObjectType_ims__c FROM QIDC__OK_Object_Mapping_ims__c`,
  //         data => {
  //           let objectsMappings = data.records.map(object => {
  //             return {
  //               Id: object.Id,
  //               sObjectName: object.QIDC__SObjectType_ims__c,
  //               oneKeyObjectName: object.QIDC__OneKey_Entity_ims__c,
  //             }
  //           });
  //           resolve(objectsMappings);
  //         },
  //         error => {
  //             console.log(error);
  //             reject(error);
  //         });
  //   });
  // }

  // fetchFieldMappings = (objectId) => {
  //   return new Promise((resolve, reject) => {
  //     sfNetAPI
  //       .query(`SELECT Id, QIDC__OneKey_Attribute_ims__c, QIDC__SObject_Field_ims__c FROM QIDC__OK_Field_Mapping_ims__c WHERE QIDC__OK_Object_Mapping_ims__c = '${objectId}'`,
  //         data => {
  //           let fieldMappings = data.records.map(field => {
  //             return {
  //               Id: field.Id,
  //               sFieldName: field.QIDC__SObject_Field_ims__c,
  //               oneKeyFieldName: field.QIDC__OneKey_Attribute_ims__c,
  //             }
  //           });
  //           resolve(fieldMappings);
  //         },
  //         error => {
  //             console.log(error);
  //             reject(error);
  //         });
  //   });
  // }

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
    return new Promise((resolve, reject) => {
      sfNetAPI
        .describe(`User`,
          data => {
            let availableCountriesMetadata, availableCountriesLabels;
            if (data) {
              availableCountriesMetadata = data.fields.find( field => {
                return field.name === "QIDC__OK_Available_Countries_ims__c"
              });
              availableCountriesLabels = availableCountriesMetadata ? availableCountriesMetadata.picklistValues : [];
            }
            resolve(availableCountriesLabels);
          },
          error => {
              console.log(error);
              reject(error);
          });
    });
  }

  fetchCountriesValues = () => {
    const userID = environment.userID();

    return dbManager
      .fetch(`SELECT QIDC__OK_Available_Countries_ims__c FROM USER WHERE ID = '${userID}'`)
  }

  getWorkplaces = async (queryString) => {
    try {
      const { mappings } = this.state;
      const workplaceSObject = mappings.find( objectMapping => objectMapping.oneKeyObjectName === 'Workplace')
      const workplaces = await this.fetchWorkplaces(workplaceSObject, queryString);

      return workplaces.records.length ? mapWorkplaces(workplaces) : [];
    }catch(error) {
      console.log(error);
      return error;
    }
  }

  fetchWorkplaces = async (sObject, queryString) => {
    const sObjectName = sObject ? sObject.sObjectName : 'Account';
    const queryStringilter = queryString && queryString.length ? `Where Name Like '%${queryString}%'` : '';
    return dbManager
            .fetch(`Select Id, Name from ${sObjectName} ${queryStringilter}`)
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
    return new Promise((resolve, reject) => {
      sfNetAPI
        .query(`Select Id, Name, QIDC__Label_ims__c, QIDC__LIS_Code_ims__c From QIDC__OK_Code_ims__c ${filter}`,
          data => {
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
            resolve(picklistByName);
          },
          error => {
            this.setState(() => {
                return {
                  ...this.state,
                  isLoading: false,
                  loadingMessage: "",
                };
            });
              console.log(error);
              reject([]);
          });
    });
  }

  getWorkplaceCategories = (countryIsoCode) => {
    const filter = countryIsoCode ? `Where QIDC__LIS_Code_ims__c = 'LEX' And QIDC__Country_ims__c = '${countryIsoCode}'` : `Where QIDC__LIS_Code_ims__c = 'LEX'`;

    return new Promise((resolve, reject) => {
      sfNetAPI
        .query(`Select Id, Name, QIDC__Label_ims__c From QIDC__OK_Code_ims__c ${filter}`,
          data => {
            let workplaceCategories = data.records.map( category => {
              return {
                label: category.QIDC__Label_ims__c,
                value: category.Name
              }
            });
            resolve(workplaceCategories);
          },
          error => {
              console.log(error);
              reject(error);
          });
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

    return new Promise((resolve, reject) => {
      sfNetAPI
        .query(`SELECT ${sField} FROM QIDC__Validation_Request_Required_Fields_ims__c WHERE QIDC__Country_ISO_Code_ims__c = '${countryIsoCode}'`,
          data => {
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

            resolve(requiredFields);
          },
          error => {
            this.setState(() => {
                return {
                  ...this.state,
                  isLoading: false,
                  loadingMessage: "",
                };
            });
            console.log(error);
            reject(error);
          });
    });
  }

  getFormData = object => Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
  }, new FormData());

  handleSubmit = async (values, { setSubmitting }) => {
    const userID = environment.userID();
    const { navigate } = this.props.navigation;
    let workplaceData;

    if ( values.entityType === "Workplace" ){
      workplaceData = mapWorkplaceFormValues(values, userID);
    }else if (values.entityType === "Activity"){
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

      let responseOneKey = await this.submitOneKeyRequest(workplaceData);
      let responseToJson = await responseOneKey.json();

      console.log("OneKey payload: ", workplaceData);

      console.log("OneKey response: ", responseToJson);


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
      console.error(error);
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
    console.log(isValid);
    try {
      const countryISO = formValues.address.country;
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

  // To make request:
  //  - Change SUBMIT_URL to proper submit url
  //  - Add Authorization token 
  submitOneKeyRequest = requestData => {
    return fetch('SUBMIT_URL', {
      method: 'POST',
      credentials: 'include',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ''
      },
      body: JSON.stringify(requestData)
    });
  }

  submitSFRequest = (requestData) => {
    return new Promise((resolve, reject) => {
      sfNetAPI
        .create(`QIDC__Validation_Request_ims__c`, {
            Name: requestData['workplace.usualName'],
            QIDC__Name_ims__c: requestData['workplace.usualName'],
            QIDC__City_ims__c: requestData['address.city'],
            QIDC__Country_ISO_Code_ims__c: requestData['address.country'],
          },
          data => {
            console.log(data);
            this.setState({showRequestSubmittedMessage: true});
            setTimeout(()=>{this.setState({showRequestSubmittedMessage: false})}, 2000);
            resolve(data);
          },
          error => {
              console.log(error);
              reject(error);
          });
    });
  }

  getValidationSchema = () => {
    const { requiredFields } = this.state;

    return Yup.object().shape({
        address: Yup.object().shape({
          country: Yup
            .string()
            .nullable()
            .required('Required'),
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
          typeCode: Yup.string().test('required', 'Required', function(value) {
            const isRequired = requiredFields.find((f) => f === 'Workplace_Type_ims__c');
            if (isRequired){
              return value && value.length > 0;
            }
            return true;
          }),
          category: Yup.string().test('required', 'Required', function(value) {
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

    const { navigation } = this.props;
    const initialData = navigation.getParam('itemData');

    return (
      <Fragment>
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
        <ScrollView>
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
                <View style={styles.container}>
                  <View style={styles.formSection}>
                    <View style={styles.formSectionRow}>
                      <View style={styles.formInput}>
                        <Text style={styles.label}>
                          <Text style={styles.labelText}>Record Type</Text>
                        </Text>
                        <RNPickerSelect
                            onValueChange={handleChange('entityType')}
                            items={entityTypes}
                            onClose={() => this.handleEntityTypeClose(values, errors)}
                            placeholder={{label: 'Choose a Record Type', value: null}}
                            value={values.entityType}
                            style={{...pickerSelectStyles,
                              iconContainer: {
                                top: 10,
                                right: 12,
                              },
                            }}
                            Icon={() => {
                              return <Icon name="chevron-down" size={24} color="black" />;
                            }}
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
                            <RNPickerSelect
                              onValueChange={handleChange('address.country')}
                              items={countries}
                              onClose={() => this.handleCountryClose(values)}
                              placeholder={{label: 'Choose a Country', value: ''}}
                              value={values.country}
                              style={{...pickerSelectStyles,
                                iconContainer: {
                                  top: 10,
                                  right: 12,
                                },
                              }}
                              Icon={() => {
                                return <Icon name="chevron-down" size={24} color="black" />;
                              }}
                            />
                          </View> : null
                        }
                      </View>
                      <View style={styles.formInput}>
                      </View>
                    </View>
                  </View>
                  {
                    values.entityType === "Workplace" ?
                      <Workplace
                        formData={{workplace: values.workplace, address: values.address}}
                        picklists={picklists}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        requiredFields={requiredFields}
                        fetchWorkplaces={this.getWorkplaces}
                        setFieldValue={setFieldValue}
                      />
                    : null
                  }
                  {
                    values.entityType === "Activity" ?
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
                          fetchWorkplaces={this.getWorkplaces}
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
              <View style={styles.loader}>
                <ActivityIndicator animating={true} color={Colors.blue500}/>
                <Text style={styles.loaderText}>{loadingMessage}</Text>
              </View> : null
            }

          </SafeAreaView>
        </ScrollView>
      </Fragment>
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
    width: "30%",
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
  requiredLabel: {
    color: Colors.red600
  },
  label: {
    flexDirection: "row",
    marginBottom: 8,
  },
  labelText: {
    marginRight: 3,
  },
  labelRequired: {
    color: Colors.red800
  },
  loader: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    zIndex: 100,
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.7)"
  },
  loaderText: {
    color: "#7c7f81",
    fontSize: 15,
    paddingTop: 20,
    position: "absolute",
    top: "50%",
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 11,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: "100%"
  },
});
