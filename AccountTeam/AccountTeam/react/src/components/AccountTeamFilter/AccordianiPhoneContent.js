import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Select } from '@oce-apps/apollo-react-native'
import { StyleSheet, View, Dimensions, Text, TextInput } from 'react-native';
import { clearFilter, setApplyFilter } from '../../store/sortSlice/sortListSlice'
import { fetchAccountTeams } from '../../store/accountSlice/accountSlice'
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { FilterInput } from '../FilterInput/FilterInput'
import { accountSelector } from '../../store/accountSlice/accountSelector';

const windowWidth = Dimensions.get('window').width;

export const AccordianiPhoneContent = () => {
    const dispatch = useDispatch();
    const { accessLevelOptions } = useSelector(accountSelector);
    let [inputTextValue, setInputTextValue] = useState({});
    const [selectedAccessLevel, setSelectedAccessLevel] = useState(null);

    const onChangeInputText = (val = '', key) => {
        const obj = {}
        obj[key] = '';
        if (val) {
            obj[key] = val?.value || val;
        }
        let updatedInputTextVal = { ...inputTextValue, ...obj }
        setInputTextValue({ ...updatedInputTextVal });
        if (val?.value) {
            setSelectedAccessLevel(val);
        }

    }
    const onClearFilter = () => {
        setInputTextValue({});
        setSelectedAccessLevel(null);
        dispatch(clearFilter())
        dispatch(fetchAccountTeams());
    }
    const onApplyfilter = () => {
        dispatch(setApplyFilter(inputTextValue))
    }


    return (
        <View style={styles.textInputContainer} testID={'accordianiPhoneContent'}>
            <View style={styles.row}>
                <View style={styles.flex}>
                    <FilterInput
                        onChangeInputText={(val) => onChangeInputText(val, 'User.Name')}
                        placeholder="User Name"
                        value={inputTextValue['User.Name']}
                    />
                </View>
                <View style={styles.flex}>
                    <FilterInput style={{ marginLeft: 5 }} onChangeInputText={(val) => onChangeInputText(val, 'Territory2.Name')} placeholder="Territory Name" value={inputTextValue['Territory2.Name']} />
                </View>
            </View>
            <View style={[styles.row, styles.mt10]}>
                <View style={styles.flex}>
                    <FilterInput onChangeInputText={(val) => onChangeInputText(val, 'User.Phone')} placeholder="Phone" value={inputTextValue['User.Phone']} />
                </View>
                <View style={styles.flex}>
                    <Select
                        options={accessLevelOptions}
                        value={selectedAccessLevel}
                        onChange={(val) => onChangeInputText(val, 'Territory2.AccountAccessLevel')}
                        style={styles.select}
                        placeholder="Select Access Level..."
                    />
                </View>
            </View>
            <View style={styles.mt10}>
                <FilterButtons onApplyfilter={onApplyfilter} onClearFilter={onClearFilter} />
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    textInputContainer: {
        marginVertical: 10
    },
    row: {
        flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between'
    },
    flex: {
        flex: 1
    },
    select: {
        paddingRight: 5,
        maxWidth: '100%',
        marginLeft: 5
    },
    mt10: {
        marginTop: 10
    }

});
