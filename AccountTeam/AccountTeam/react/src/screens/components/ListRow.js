import React, { useRef } from 'react';
import { StyleSheet, View, Pressable, TouchableOpacity } from 'react-native';
import { themePrimary, neutral05, Accordion, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color'
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { accountSelector } from '../../store/accountSlice/accountSelector';
import { Cell } from '../../components/Cell/Cell'
import { setSelectedRow, setPositionofInfoContainer, setInfoContainerVisible, setListRowHeight, setMaximumHeight, setActiveIndex } from '../../store/accountSlice/accountSlice'
import { setSortListVisibile } from '../../store/sortSlice/sortListSlice'
import { getRectForRef } from '../../utils/helper'
import { isIphone } from '../../constants'

export const ListRow = ({ item, index }) => {
    const infoIconRef = useRef();
    const rowRef = useRef();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { accessLevelOptions, activeIndex } = useSelector(accountSelector);
    const showDetailInfo = async (selectedRow) => {
        const position = await getRectForRef(infoIconRef);
        const rowRefs = await getRectForRef(rowRef);
        dispatch(setInfoContainerVisible(false));
        dispatch(setActiveIndex(index))
        dispatch(setMaximumHeight('auto'))
        dispatch(setListRowHeight(rowRefs.height));
        dispatch(setPositionofInfoContainer(position))
        dispatch(setSelectedRow(selectedRow));
        dispatch(setSortListVisibile(false));
        if (activeIndex === index) {
            dispatch(setInfoContainerVisible(false));
        } else {
            dispatch(setInfoContainerVisible(true));
        }
    }
    const onDismissPopUps = () => {
        dispatch(setInfoContainerVisible(false))
        dispatch(setSortListVisibile(false));
    }

    const accessLevelLabel = accessLevelOptions.filter((al) => al.value === item?.Territory2.AccountAccessLevel)[0];
    return (
        <Pressable style={{ flex: 1 }} testID={`touchableWrapper_${index}`} onPress={onDismissPopUps} ref={rowRef}>
            <View>
                <View style={styles.row} testID={`listItemContainer_${index}`}>
                    <Cell style={{ backgroundColor: theme.dark ? color(theme.colors.surface).darken(0.3).hex() : '#f6f7f8', justifyContent: 'center' }}
                        value={' '}
                        accessor={item?.User.Name}
                        testID={`userName_${index}`}
                    />
                    <Cell accessor={'Territory Name'}
                        style={{ backgroundColor: theme.dark ? color(theme.colors.surface).darken(0.5).hex() : 'white' }}
                        accessorStyle={[styles.customAccessorStyle, { color: theme.dark ? color(theme.colors.surface).lighten(1.5).hex() : neutral05[500] }]}
                        value={item?.Territory2.Name}
                        testID={`territoryName_${index}`} />
                    {!isIphone && <Cell accessor={'Phone'}
                        style={{ backgroundColor: theme.dark ? color(theme.colors.surface).darken(0.5).hex() : 'white' }}
                        accessorStyle={[styles.customAccessorStyle, { color: theme.dark ? color(theme.colors.surface).lighten(1.5).hex() : neutral05[500] }]}
                        valueStyle={{ color: theme.colors.primary, fontWeight: '400' }}
                        value={item?.User.Phone}
                        testID={`phone_${index}`} />
                    }
                    {!isIphone && <Cell accessor={'Account Access Level'}
                        style={{ backgroundColor: theme.dark ? color(theme.colors.surface).darken(0.5).hex() : 'white' }}
                        accessorStyle={[styles.customAccessorStyle, { color: theme.dark ? color(theme.colors.surface).lighten(1.5).hex() : neutral05[500] }]}
                        value={accessLevelLabel?.label}
                        testID={`accountAccessLevel_${index}`} />
                    }
                    <View style={[styles.iconContainer, { backgroundColor: theme.dark ? color(theme.colors.surface).darken(0.5).hex() : 'white' }]} ref={infoIconRef} testID={`actionBtn_${index}`} >
                        <TouchableOpacity onPress={() => showDetailInfo(item)} testID={`detailInfo_${index}`}>
                            <MaterialIcon name="information-outline" color={neutral05[500]} size={32} testID={`detailInfoIcon_${index}`} />
                        </TouchableOpacity>
                    </View>
                </View >
                {isIphone && <View>
                    <Accordion defaultExpanded={false}>
                        <Accordion.Summary title="Additional Details" />
                        <Accordion.Details style={{ backgroundColor: 'blue' }}>
                            <View style={[styles.accrodianContent, { backgroundColor: theme.dark ? theme.colors.background : '#f6f7f8' }]} testID={`listItemContainer_${index}`}>
                                <Cell accessor={'Phone'}
                                    accessorStyle={[styles.customAccessorStyle, { color: theme.dark ? color(theme.colors.surface).lighten(1.5).hex() : neutral05[500] }]}
                                    valueStyle={{ color: theme.colors.primary, fontWeight: '400' }}
                                    value={item?.User.Phone}
                                    testID={`phoneiPhone_${index}`} />
                                <Cell accessor={'Account Access Level'}
                                    accessorStyle={[styles.customAccessorStyle, { color: theme.dark ? color(theme.colors.surface).lighten(1.5).hex() : neutral05[500] }]}
                                    value={accessLevelLabel?.label}
                                    testID={`accountAccessLeveliPhone_${index}`} />
                            </View >
                        </Accordion.Details>
                    </Accordion>
                </View>}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    customAccessorStyle: {
        color: neutral05[500], marginBottom: 5, fontWeight: '400'
    },
    link: {
        color: themePrimary[500], fontWeight: '400'
    },
    iconContainer: {
        flex: isIphone ? 0.8 : 0.3, paddingHorizontal: isIphone ? 10 : 30, justifyContent: 'center', alignItems: 'center'
    },
    cellContainer: {
        flexDirection: 'row', alignContent: 'center', flex: 1
    },
    accrodianContent: {
        flexDirection: 'row', backgroundColor: '#f6f7f8', alignItems: 'flex-start'
    }


});
