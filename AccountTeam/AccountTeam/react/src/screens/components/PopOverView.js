import React, { useEffect, useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { environment } from "oce-apps-bridges";
import { neutral07 } from 'apollo-react-native';
import { DateTime } from 'luxon';
import { NAMESPACE, isIphone } from '../../constants';
import { accountSelector } from '../../store/accountSlice/accountSelector';
import { RowGrid } from './RowGrid'
import { getRectForRef } from '../../utils/helper'
import { setInfoContainerTopPosition, setMaximumHeight } from '../../store/accountSlice/accountSlice'
import { calcTopPostion, calcRightPosition } from '../../utils/helper'


export const PopOverView = () => {
    const detailContainerRef = useRef();
    const arrowIcon = useRef();
    const dispatch = useDispatch();
    const [layoutPosition, setLayoutPosition] = useState(null);
    const { position, selectedData, activeIndex, infoContainerTopPosition, iPhoneContainerWidth, maxHeight, appContainerHeight, rowHeight } = useSelector(accountSelector);
    let right = calcRightPosition(position);
    useEffect(() => {
        renderPopUpOverView();
    }, [position, selectedData, layoutPosition])
    const renderPopUpOverView = async () => {
        const arrowPostion = await getRectForRef(arrowIcon);
        if (arrowPostion.height > 0) {

            let detailPos = {};
            if (detailContainerRef.current) {
                detailPos = await getRectForRef(detailContainerRef);
            }
            const top = calcTopPostion(position, arrowPostion);
            let height = 0;
            if (arrowPostion.y > position.y) {
                let updatedTopPosition = (arrowPostion.y - (position.y + (position.height / 2)));
                height = detailPos?.height - (updatedTopPosition * 2);
                dispatch(setMaximumHeight(height));
                dispatch(setInfoContainerTopPosition(1));
                if (updatedTopPosition < 0) {
                    updatedTopPosition = updatedTopPosition * -1;
                    dispatch(setInfoContainerTopPosition(updatedTopPosition));
                }
            } else {
                let expectedTopPosition = (position.y - arrowPostion.y + (position.height / 2));
                if (expectedTopPosition > (appContainerHeight / 2) && detailPos?.x < 1000) {
                    let heightC = ((appContainerHeight - top) - 70); // 65 -> padding bottom view including safe area
                    let rowH = Math.round(rowHeight / 2);
                    dispatch(setMaximumHeight(heightC));
                    dispatch(setInfoContainerTopPosition(top + rowH));
                } else {
                    dispatch(setMaximumHeight('auto'));
                    dispatch(setInfoContainerTopPosition(expectedTopPosition));
                }

            }
        }
    }
    const setLayout = useCallback(e => {
        if (Platform.OS !== 'web') {
            setLayoutPosition(e.nativeEvent.layout.height)
        }
    })
    const popupiPhoneWidth = iPhoneContainerWidth - position.width;
    return (
        <View testID={'popOverView'} style={[styles.container, { right, maxHeight, opacity: infoContainerTopPosition, top: (Platform.OS === 'web' && activeIndex == 0) ? infoContainerTopPosition + 20 : infoContainerTopPosition, maxWidth: isIphone ? popupiPhoneWidth : 400 }]} ref={detailContainerRef}>
            <View style={styles.gridContainer}>
                <ScrollView style={{ maxHeight: maxHeight }}>
                    <RowGrid
                        testID={'nameRowGrid'}
                        primaryAccessor={'First Name'}
                        primaryValue={selectedData?.User?.FirstName}
                        secondaryAccessor={'Last Name'}
                        secondaryValue={selectedData?.User?.LastName}
                        isSecondary
                    />
                    <RowGrid
                        testID={'emailRowGrid'}
                        primaryAccessor={'Email'}
                        primaryValue={selectedData?.User?.Email}
                        secondaryAccessor={'Territory Description'}
                        secondaryValue={selectedData?.Territory2?.Description}
                        isSecondary
                    />
                    <RowGrid
                        testID={'roleRowGrid'}
                        primaryAccessor={'Role'}
                        primaryValue={''}
                        secondaryAccessor={'City'}
                        secondaryValue={selectedData?.User?.City}
                        isSecondary
                    />
                    <RowGrid
                        testID={'countryRowGrid'}
                        primaryAccessor={'Country'}
                        primaryValue={selectedData?.User?.Country}
                        secondaryAccessor={'Manager'}
                        secondaryValue={selectedData?.User?.Manager?.Name}
                        isSecondary
                    />
                    <RowGrid
                        testID={'lasySyncRowGrid'}
                        primaryAccessor={'Last synced time'}
                        primaryValue={DateTime.fromISO(selectedData?.User?.[`${NAMESPACE}LastSyncTime__c`], {
                            zone: environment.timeZone()
                        }).toFormat('yyyy LLL d,  hh:mm a')}
                        secondaryAccessor={''}
                        secondaryValue={''}

                    />
                </ScrollView>
            </View>
            <View testID='info-arrow' style={styles.triangle} ref={arrowIcon} onLayout={setLayout}></View>

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
    },
    gridContainer: {
        backgroundColor: neutral07[500],
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
        borderRadius: 10
    },
    triangle: {
        backgroundColor: neutral07[500],
        width: 15, height: 15,
        position: 'absolute',
        right: -6,
        transform: [{ rotate: '45deg' }]
    }
});
