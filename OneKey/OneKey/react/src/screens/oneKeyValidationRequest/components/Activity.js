import React, { Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, useTheme, Select } from 'apollo-react-native';
import PropTypes from "prop-types";
import { FORM_MAPPINGS } from '../constants/constants';
import color from 'color';

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

    styles.pickerStyles = {
        ...pickerSelectStyles,
        modalViewMiddle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.dark
                ? color(theme.colors.surface).lighten(0.3).hex()
                : color(theme.colors.surface).darken(0.1).hex(),
        },
        modalViewBottom: {
            backgroundColor: theme.colors.surface,
        },
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
                        <Select
                          options={picklists.courtesyTitles}
                          value={individual.prefixNameCode}
                          onChange={handleChange('individual.prefixNameCode')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Individual Title</Text>
                        <Select
                          options={picklists.individualTitles}
                          value={individual.titleCode}
                          onChange={handleChange('individual.titleCode')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Gender</Text>
                        <Select
                          options={picklists.genderList}
                          value={individual.genderCode}
                          onChange={handleChange('individual.genderCode')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Professional Type</Text>
                        <Select
                          options={picklists.individualTypeCodes}
                          value={individual.typeCode}
                          onChange={handleChange('individual.typeCode')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Role</Text>
                        <Select
                          options={picklists.roles}
                          value={activity.role}
                          onChange={handleChange('activity.role')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Primary Specialty</Text>
                        <Select
                          options={picklists.specialties}
                          value={individual.speciality1}
                          onChange={handleChange('individual.speciality1')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Specialty 2</Text>
                        <Select
                          options={picklists.specialties}
                          value={individual.speciality2}
                          onChange={handleChange('individual.speciality2')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Specialty 3</Text>
                        <Select
                          options={picklists.specialties}
                          value={individual.speciality3}
                          onChange={handleChange('individual.speciality3')}
                          placeholder="--None--"
                          fullWidth
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
    iconContainer: {
      top: 10,
      right: 12,
    },
  });

Activity.propTypes = propTypes;

export default Activity;
