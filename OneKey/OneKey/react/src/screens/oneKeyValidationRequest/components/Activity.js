import React, { Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Autocomplete, useTheme } from 'apollo-react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from "prop-types";
import { FORM_MAPPINGS } from '../constants/constants';

const propTypes = {
    formData: PropTypes.object,
    picklists: PropTypes.object
};

const Activity = props => {
    const { formData, picklists, handleChange, handleBlur, requiredFields, setFieldValue } = props;
    const { activity, individual } = formData;
    const form_map = FORM_MAPPINGS;

    const theme = useTheme();

    styles.formSectionTitleText = {
        ...styles.formSectionTitleText,
        backgroundColor: theme.dark ? theme.colors.surface : "#f4f6f9",
    }

    styles.selectLabel = {
        ...styles.selectLabel,
        color: theme.colors.text
    }

    return (
        <Fragment>
            <View style={styles.formSectionTitle}>
                <Text style={styles.formSectionTitleText}>Individual/Activity</Text>
            </View>
            <View style={styles.formSection}>
                <View style={{...styles.formSectionRow, zIndex: 100}}>
                    {/* <Autocomplete
                        style={{width: "100%", marginTop: -10}}
                        label="Individual"
                        placeholder="Search for Individual"
                        source={dictionaries.individualList}
                        onChange={handleChange('individual.individualEid')}
                        value={individual.individualEid}
                        singleSelect
                        icon="magnify"
                    /> */}
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <TextInput
                            name='individual.firstName'
                            value={individual.firstName}
                            onChangeText={handleChange('individual.firstName')}
                            onBlur={handleBlur('individual.firstName')}
                            label="First Name"
                            fullWidth
                            required={requiredFields.find(f => f === form_map.individual.firstName.oneKeyField)}
                        />
                    </View>
                    <View style={styles.formInput}>
                        <TextInput
                            name='individual.middleName'
                            value={individual.middleName}
                            onChangeText={handleChange('individual.middleName')}
                            onBlur={handleBlur('individual.middleName')}
                            label="Middle Name"
                            fullWidth
                            required={requiredFields.find(f => f === form_map.individual.middleName.oneKeyField)}
                        />
                    </View>
                    <View style={styles.formInput}>
                        <TextInput
                            name='individual.lastName'
                            value={individual.lastName}
                            onChangeText={handleChange('individual.lastName')}
                            onBlur={handleBlur('individual.lastName')}
                            label="Last Name"
                            fullWidth
                            required={requiredFields.find(f => f === form_map.individual.lastName.oneKeyField)}
                        />
                    </View>
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Courtesy Title</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('individual.prefixNameCode')}
                            items={picklists.courtesyTitles}
                            placeholder={{label: '--None--', value: null}}
                            value={individual.courtesyTitleCode}
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
                    <Text style={styles.selectLabel}>Individual Title</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('individual.titleCode')}
                            items={picklists.individualTitles}
                            placeholder={{label: '--None--', value: null}}
                            value={individual.titleCode}
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
                        <Text style={styles.selectLabel}>Gender</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('individual.genderCode')}
                            items={picklists.genderList}
                            placeholder={{label: '--None--', value: null}}
                            value={individual.genderCode}
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
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Professional Type</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('individual.typeCode')}
                            items={picklists.individualTypeCodes}
                            placeholder={{label: '--None--', value: null}}
                            value={individual.typeCode}
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
                        <Text style={styles.selectLabel}>Role</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('activity.role')}
                            items={picklists.roles}
                            placeholder={{label: '--None--', value: null}}
                            value={activity.role}
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
                        <Text style={styles.selectLabel}>Primary Specialty</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('individual.speciality1')}
                            items={picklists.specialties}
                            placeholder={{label: '--None--', value: null}}
                            value={activity.specialty1}
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
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Specialty 2</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('individual.speciality2')}
                            items={picklists.specialties}
                            placeholder={{label: '--None--', value: null}}
                            value={activity.specialty2}
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
                        <Text style={styles.selectLabel}>Specialty 3</Text>
                        <RNPickerSelect
                            onValueChange={handleChange('individual.speciality3')}
                            items={picklists.specialties}
                            placeholder={{label: '--None--', value: null}}
                            value={activity.specialty3}
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
                    </View>
                </View>
            </View>
        </Fragment>
    )
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
    
Activity.propTypes = propTypes;
  
export default Activity;
