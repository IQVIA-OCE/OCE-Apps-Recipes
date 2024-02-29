import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Select } from '@oce-apps/apollo-react-native'
import { StyleSheet, View } from 'react-native';
import { clearFilter, setApplyFilter } from '../../store/sortSlice/sortListSlice'
import { fetchAccountTeams } from '../../store/accountSlice/accountSlice'
import { FilterButtons } from '../FilterButtons/FilterButtons';
import { FilterInput } from '../FilterInput/FilterInput'
import { accountSelector } from '../../store/accountSlice/accountSelector';

export const AccordianContent = () => {
    const dispatch = useDispatch();
    const { accessLevelOptions } = useSelector(accountSelector);
    let [inputTextValue, setInputTextValue] = useState({ ['User.Name']: '', ['Territory2.Name']: '', ['User.Phone']: '', ['Territory2.AccountAccessLevel']: '' });
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
        setInputTextValue({ ['User.Name']: '', ['Territory2.Name']: '', ['User.Phone']: '', ['Territory2.AccountAccessLevel']: '' });
        setSelectedAccessLevel(null);
        dispatch(clearFilter())
        dispatch(fetchAccountTeams());
    }
    const onApplyfilter = () => {
        dispatch(setApplyFilter(inputTextValue))
    }
    return (
        <View>
            <View style={[styles.textInputContainer]} testID={'accordianContent'}>
                <View style={styles.flex}>
                    <FilterInput
                        onChangeInputText={(val) => onChangeInputText(val, 'User.Name')}
                        placeholder="User Name"
                        value={inputTextValue['User.Name']}
                    />
                </View>
                <View style={styles.flex}>
                    <FilterInput style={[styles.textInput]} onChangeInputText={(val) => onChangeInputText(val, 'Territory2.Name')} placeholder="Territory Name" value={inputTextValue['Territory2.Name']} />
                </View>
                <View style={styles.flex}>
                    <FilterInput style={[styles.textInput]} onChangeInputText={(val) => onChangeInputText(val, 'User.Phone')} placeholder="Phone" value={inputTextValue['User.Phone']} />
                </View>
                <View style={styles.flex}>
                    <Select
                        options={accessLevelOptions}
                        value={selectedAccessLevel}
                        style={styles.select}
                        onChange={(val) => onChangeInputText(val, 'Territory2.AccountAccessLevel')}
                        placeholder="Select Access Level..."
                    />
                </View>
            </View>
            <View style={styles.mh10}>
                <FilterButtons onApplyfilter={onApplyfilter} onClearFilter={onClearFilter} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textInputContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        alignContent: 'center',
    },
    flex: {
        flex: 1
    },
    textInput: {
        marginLeft: 10,
    },
    select: {
        paddingRight: 10,
        marginLeft: 10
    },
    mh10: {
        marginRight: 10,
    }

});
