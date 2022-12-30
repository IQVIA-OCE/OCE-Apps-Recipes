import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
    const { position, selectedData, infoContainerTopPosition, iPhoneContainerWidth, maxHeight, appContainerHeight, rowHeight } = useSelector(accountSelector);
    let right = calcRightPosition(position);
    useEffect(() => {
        (async () => {
            const arrowPostion = await getRectForRef(arrowIcon);
            let detailPos = {};
            if (detailContainerRef.current) {
                detailPos = await getRectForRef(detailContainerRef);
            }
            const top = calcTopPostion(position, arrowPostion);
            const y = arrowPostion.y - (rowHeight / 2);
            let height = 0;
            if (arrowPostion.y > position.y) {
                let nwtop = (arrowPostion.y - (position.y + (position.height / 2)));
                height = detailPos?.height - (nwtop * 2);
                dispatch(setMaximumHeight(height));
                if (nwtop < 0) {
                    nwtop = nwtop * -1
                    dispatch(setInfoContainerTopPosition(nwtop));
                }
            } else {
                let tt = (position.y - arrowPostion.y) + (position.height / 2);
                if (tt > (appContainerHeight / 2) && detailPos?.x < 1000) {
                    let heightC = ((appContainerHeight - top) - 70); // 65 -> padding bottom view including safe area
                    let rowH = Math.round(rowHeight / 2);
                    dispatch(setMaximumHeight(heightC));
                    dispatch(setInfoContainerTopPosition(top + rowH));
                } else {
                    dispatch(setMaximumHeight('auto'));
                    dispatch(setInfoContainerTopPosition(tt));
                }
            }
        })();
    }, [selectedData, position])
    const popupiPhoneWidth = iPhoneContainerWidth - position.width;
    return (
        <View testID={'popOverView'} style={[styles.container, { right, maxHeight, top: infoContainerTopPosition, maxWidth: isIphone ? popupiPhoneWidth : 400 }]} ref={detailContainerRef}>
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
            <View style={styles.triangle} ref={arrowIcon}></View>

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