import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { themePrimary, neutral04, Text, useTheme } from '@oce-apps/apollo-react-native';
import { SEARCH_FIELDS, DTP_SEARCH_FIELDS, LOADING_STATUS } from '../../constants';
import { SearchFilter } from '../../components/SearchFilter/SearchFilter';
import { SampleLotReport } from "../SampleLotReport/SampleLotReport";
import { DTPAllocationReport } from "../DTPAllocationReport/DTPAllocationReport"
import { bootstrap } from '../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSlice';
import { loadingStatusSelector } from '../../store/SamplesLotAllocationReport/SamplesLotAllocationReportSelectors'
import { setActiveScreen } from '../../store/Search/SearchSlice';
import { activeScreenSelector } from '../../store/Search/SearchSelector'

export const ReportScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const loadingStatus = useSelector(loadingStatusSelector);
    const activeScreen = useSelector(activeScreenSelector);
    const [activeTab, setActiveTab] = useState(1);
    const isLoading = loadingStatus === LOADING_STATUS.PENDING;
    const onClear = () => {
        dispatch(bootstrap());
    }
    const onChangeTab = (index) => {
        setActiveTab(index);
        let activeScreen = 'sla';
        if (index === 2) {
            activeScreen = 'dtp';
        }
        dispatch(setActiveScreen(activeScreen))
    }
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SearchFilter
                isLoading={isLoading}
                onClear={onClear}
                searchOptions={activeTab === 1 ? SEARCH_FIELDS : DTP_SEARCH_FIELDS}
                activeScreen={activeScreen} />
            <View style={[styles.flexView, { backgroundColor: theme.colors.background }]} >
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={[styles.tabBtnContainer, {
                        borderBottomColor: activeTab === 1 ? themePrimary[500] : neutral04[500],
                        borderBottomWidth: activeTab === 1 ? 2 : 1,
                    }]} onPress={() => onChangeTab(1)}>
                        <Text style={{ fontSize: 16, fontWeight: activeTab === 1 ? 'bold' : '400' }}>Sample Lots</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabBtnContainer, {
                        borderBottomColor: activeTab === 2 ? themePrimary[500] : neutral04[500],
                        borderBottomWidth: activeTab === 2 ? 2 : 1,
                    }]} onPress={() => onChangeTab(2)}>
                        <Text style={{ fontSize: 16, fontWeight: activeTab === 2 ? 'bold' : '400' }}>Product Allocation (DTP)</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.listContainer}>
                    <View style={styles.listView}>
                        {activeTab === 1 && <SampleLotReport navigation={navigation} title={'Samples Lots Allocation Report'} />}
                        {activeTab === 2 && <DTPAllocationReport navigation={navigation} title={'Product Allocation Report(DTP)'} />}
                    </View>
                </View>
            </View>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 15, flex: 1
    },
    tabContainer: {
        flexDirection: 'row',
        marginVertical: 20,
    },
    tabBtnContainer: {
        flex: 1,
        paddingBottom: 10,
    },
    listContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    listView: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    flexView: {
        flex: 1,
    }
});
