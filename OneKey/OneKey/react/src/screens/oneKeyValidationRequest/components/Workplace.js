import React, { Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Select, TextInput, useTheme } from 'apollo-react-native';
import PropTypes from "prop-types";
import { FORM_MAPPINGS } from '../constants/constants';
import color from "color";

const propTypes = {
    formData: PropTypes.object,
    picklists: PropTypes.object
};

const Workplace = props => {
    const { formData, picklists, handleChange, handleBlur, requiredFields, errors, scrollToInput, onDropdownClose, onDropdownShow, setFieldValue} = props;
    const { workplace, address } = formData;
    const w_form_map = FORM_MAPPINGS;

    const theme = useTheme();

    styles.formSectionTitle = {
        ...styles.formSectionTitle,
        backgroundColor: theme.dark ? theme.colors.surface : "#f4f6f9"
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
                <Text style={styles.formSectionTitleText}>Workplace</Text>
            </View>
            <View style={styles.formSection}>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <TextInput
                            name='workplace.usualName'
                            value={workplace.usualName}
                            onChangeText={handleChange('workplace.usualName')}
                            onBlur={handleBlur('workplace.usualName')}
                            label="Name"
                            fullWidth
                            required={requiredFields.find(f => f === w_form_map.workplace.usualName.oneKeyField)}
                        />
                    </View>
                    <View style={styles.formInput}>
                        <TextInput
                            name='workplace.parentUsualName'
                            value={workplace.parentUsualName}
                            onChangeText={handleChange('workplace.parentUsualName')}
                            onBlur={handleBlur('workplace.parentUsualName')}
                            label="Organization Name"
                            fullWidth
                            required={requiredFields.find(f => f === w_form_map.workplace.parentUsualName.oneKeyField)}
                        />
                    </View>
                    <View style={styles.formInput}>
                        <TextInput
                            name='workplace.telephone'
                            value={workplace.telephone}
                            onChangeText={handleChange('workplace.telephone')}
                            onBlur={handleBlur('workplace.telephone')}
                            label="Telephone No"
                            fullWidth
                            required={requiredFields.find(f => f === w_form_map.workplace.telephone.oneKeyField)}
                        />
                    </View>
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Workplace Type</Text>
                        <Select
                          options={picklists.workplaceTypes}
                          value={workplace.typeCode}
                          onChange={handleChange('workplace.typeCode')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.selectLabel}>Category</Text>
                        <Select
                          options={picklists.workplaceCategories}
                          value={workplace.category}
                          onChange={handleChange('workplace.category')}
                          placeholder="--None--"
                          fullWidth
                        />
                    </View>
                    <View style={styles.formInput}>
                        <TextInput
                            name='address.longLabel'
                            value={address.longLabel}
                            onChangeText={handleChange('address.longLabel')}
                            onBlur={handleBlur('address.longLabel')}
                            label="Address Line 1"
                            fullWidth
                            required={requiredFields.find(f => f === w_form_map.address.longLabel.oneKeyField)}
                        />
                    </View>
                </View>
                <View style={styles.formSectionRow}>
                    <View style={styles.formInput}>
                        <TextInput
                            name='address.city'
                            value={address.city}
                            onChangeText={handleChange('address.city')}
                            onBlur={handleBlur('address.city')}
                            label="City"
                            fullWidth
                            required
                        />
                    </View>
                    <View style={styles.formInput}>
                        <TextInput
                            name='address.longPostalCode'
                            value={address.longPostalCode}
                            onChangeText={handleChange('address.longPostalCode')}
                            onBlur={handleBlur('address.longPostalCode')}
                            label="Postal Code"
                            fullWidth
                            required={requiredFields.find(f => f === w_form_map.address.longPostalCode.oneKeyField)}
                        />
                    </View>
                    <View style={styles.formInput}>
                        <TextInput
                            name='address.countyCode'
                            value={address.countyCode}
                            onChangeText={handleChange('address.countyCode')}
                            onBlur={handleBlur('address.countyCode')}
                            label="County"
                            fullWidth
                        />
                    </View>
                </View>
                <View style={styles.formSectionTitle}>
                    <Text style={styles.formSectionTitleText}>Other</Text>
                </View>
                <View style={{...styles.formSectionRow}}>
                    <TextInput
                        name='workplace.requestComments'
                        value={workplace.requestComments}
                        onChangeText={handleChange('workplace.requestComments')}
                        onBlur={handleBlur('workplace.requestComments')}
                        label="Request Comments"
                        fullWidth
                        multiline
                        numberOfLines={3}
                    />
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
    },
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

  const autocompleteStyles = StyleSheet.create({
    autocompletesContainer: {
        paddingTop: 0,
        // zIndex: 10,
        width: "100%",
        marginBottom: 10,
    },
    input: {
        maxHeight: 40,
        borderColor: '#bdbdbd',
        fontSize: 16,
        lineHeight: 18
    },
    inputContainer: {
        display: "flex",
        flexShrink: 0,
        flexGrow: 0,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#c7c6c1",
        paddingVertical: 13,
        paddingRight: 12,
        paddingLeft: "5%",
        width: "100%",
        justifyContent: "flex-start",
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    plus: {
        position: "absolute",
        left: 15,
        top: 10,
    },
  });

Workplace.propTypes = propTypes;

export default Workplace;
