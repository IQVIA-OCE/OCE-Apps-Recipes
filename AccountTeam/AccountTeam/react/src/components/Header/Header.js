import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';
import { themePrimary } from 'apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AccountTeamSearchInput } from '../AccountTeamSearchInput/AccountTeamSearchInput';
import { AccountTeamSortList } from '../AccountTeamSortList/AccountTeamSortList'
import { AccrodianHeader } from '../AccountTeamFilter/AccrodianHeader'
import { sortListSelector } from '../../store/sortSlice/sortListSelector';
import { AccordianContent } from '../AccountTeamFilter/AccordianContent';
import { AccordianiPhoneContent } from '../AccountTeamFilter/AccordianiPhoneContent';
import { setSearchQuery, setInfoContainerVisible } from '../../store/accountSlice/accountSlice'
import { setSortListVisibile } from '../../store/sortSlice/sortListSlice'
import { isIphone } from '../../constants'


export const Header = () => {
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const { filterCount } = useSelector(sortListSelector);
    const toggleExpansion = () => {
        setExpanded(!expanded);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };
    const onSearch = (value) => {
        dispatch(setSearchQuery(value));
        dispatch(setInfoContainerVisible(false))
        dispatch(setSortListVisibile(false));
    }
    return (
        <View testID='header'>
            <View style={isIphone ? styles.iPhoneHeaderContainer : styles.headerContainer}>
                <View >
                    <Text style={styles.title}>Account Team</Text>
                </View>
                <View>
                    <View style={isIphone ? '' : styles.headerActionContainer}>
                        <View style={isIphone ? styles.mt10 : styles.searchiPadContainer}>
                            <AccountTeamSearchInput onSearch={onSearch} />
                        </View>
                        <View style={[styles.row, isIphone ? styles.mt10 : '']}>
                            <View style={isIphone ? '' : styles.sortiPadContainer}>
                                <AccountTeamSortList />
                            </View>
                            <View>
                                <TouchableWithoutFeedback testID={'accordianView'} onPress={toggleExpansion}>
                                    <View>
                                        <AccrodianHeader title={'Filter'} expanded={!expanded} filterCount={filterCount} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View />
            {
                expanded &&
                <View style={{ zIndex: -1 }}>
                    {isIphone ? <AccordianiPhoneContent /> : <AccordianContent />}
                </View>
            }
        </View >
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    container: {
        overflow: 'hidden',
        zIndex: -1
    },
    title: {
        fontSize: 20,
        fontWeight: '600'
    },
    iPhoneHeaderContainer: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: themePrimary[500]
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: themePrimary[500]
    },
    headerActionContainer: {
        flexDirection: 'row', alignItems: 'center'
    },
    searchiPadContainer: {
        maxWidth: 200, paddingHorizontal: 10
    },
    sortiPadContainer: {
        paddingHorizontal: 10
    },
    mt10: {
        marginTop: 10
    },
    child: {
        backgroundColor: 'pink',
        padding: 16,
    }

});
