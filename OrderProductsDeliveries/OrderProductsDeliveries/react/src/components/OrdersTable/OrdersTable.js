import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Cell from './Cell';
import OrderCell from './OrderCell';
import { getDatesFromOrders, getSummQtyByDate } from './helpers';
import { ApolloProgress, useTheme } from 'apollo-react-native';
import { localized, environment } from 'oce-apps-bridges';
import color from 'color';

const NAMESPACE = environment.namespace();
const cellHeight = 60;

const OrdersTable = () => {

    const [dates, setDates] = useState([]);
    const [_datesView, setDatesView] = useState(null);
    const [_quantityView, setQuantitysView] = useState(null);
    const [_totalsView, setTotalsView] = useState(null);

    const orders = useSelector((state) => state.ordersListReducers.orders);
    const isLoading = useSelector(state => state.ordersListReducers.loading);

    let datesViewIsScrolling = false;
    let quantityViewIsScrolling = false;
    let totalsViewIsScrolling = false;

    const theme = useTheme();
    
    useEffect(() => {
        setDates(getDatesFromOrders(orders));
    }, [orders]);

    const datesOnScroll = (e) => {
        if (!datesViewIsScrolling) {
            quantityViewIsScrolling = true;
            totalsViewIsScrolling = true;
            var scrollX = e.nativeEvent.contentOffset.x;
            _quantityView.scrollTo({ x: scrollX, animated: false });
            _totalsView.scrollTo({ x: scrollX, animated: false });
        }
        datesViewIsScrolling = false;
    }

    const qtyOnScroll = (e) => {
        if (!quantityViewIsScrolling) {
            datesViewIsScrolling = true;
            totalsViewIsScrolling = true;
            var scrollX = e.nativeEvent.contentOffset.x;
            _datesView.scrollTo({ x: scrollX, animated: false });
            _totalsView.scrollTo({ x: scrollX, animated: false });
        }
        quantityViewIsScrolling = false;
    }

    const totalQtyOnScroll = (e) => {
        if (!totalsViewIsScrolling) {
            datesViewIsScrolling = true;
            quantityViewIsScrolling = true;
            var scrollX = e.nativeEvent.contentOffset.x;
            _datesView.scrollTo({ x: scrollX, animated: false });
            _quantityView.scrollTo({ x: scrollX, animated: false });
        }
        totalsViewIsScrolling = false;
    }

    const backgroundColor = theme.dark ? '#2c2c2f' : '#fff';

    if (isLoading) return (
        <View style={{ height: 400, alignItems: 'center', justifyContent: 'center', backgroundColor }} testID="loading-view">
            <ApolloProgress />
        </View>
    )

    if (!orders?.length) return (
        <View style={{ height: 400, alignItems: 'center', justifyContent: 'center', backgroundColor }}>
            <Text style={{ color: theme.colors.text }}>No data found</Text>
        </View>
    );

    if (dates.length === 0) return null;

    const secondaryDarkBackgroundColor = color(theme.colors.surface).lightness(10).hex();
    const getColorForCells = (i) => {
        if (theme.dark) {
            return i % 2 === 0 ? secondaryDarkBackgroundColor : color(theme.colors.background).lightness(5).hex()
        }
        return i % 2 === 0 ? '#f3f3f4' : '#f9fafb'
    }

    const getColorForOrdersCells = (i) => {
        console.log(theme.dark);
        if (theme.dark) {
            return i % 2 === 0 ? color(theme.colors.surface).lightness(15).hex() : color(theme.colors.background).lightness(10).hex()
        }
        return i % 2 === 0 ? '#f9fafb' : '#feffff'
    }

    return (
        <View style={{ height: 400, backgroundColor }} testID="table-container">
            <View style={styles.header}>
                <View style={{ ...styles.listItem, width: '20%', padding: 10, backgroundColor }} testID="product-name-th">
                    <Text style={{ color: theme.colors.text }}>Product Name/Code</Text>
                </View>
                <View style={{ ...styles.listItem, width: '70%' }}>
                    <ScrollView
                        horizontal
                        scrollEventThrottle={16}
                        ref={(scrollView) => {
                            setDatesView(scrollView);
                        }}
                        style={{ width: '100%', backgroundColor: theme.dark ? secondaryDarkBackgroundColor : '#f3f3f4' }}
                        onScroll={datesOnScroll}
                        bounces={false}
                        testID="dates-th-scrollview"
                    >
                        <View style={styles.dateCellWrap}>
                            {dates.map((item, index) => {
                                return (
                                    <Cell key={index} content={item.date} style={[styles.dateCell, 
                                        { borderEndColor: theme.dark ? color(theme.colors.background).lightness(30).hex() : '#E6E6E6'}]} />
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
                <View style={{ ...styles.listItem, width: '10%', alignItems: 'center', backgroundColor }} testID="total-qty-th">
                    <Text style={{ color: theme.colors.text }}>
                        {`${localized(`${NAMESPACE}order_total`, 'Total')} `}
                        {`${localized(`${NAMESPACE}qty`, 'Qty')}`}
                    </Text>
                </View>
            </View>
            <ScrollView
                style={{ width: '100%', height: '100%' }}
                contentContainerStyle={{ flexDirection: 'row' }}
                testID="main-scrollview"
            >
                <ScrollView horizontal style={{ width: '20%' }} contentContainerStyle={{ width: '100%' }}>
                    <View style={{ width: '100%' }}>
                        {orders.map((item, i) => {
                            return (
                                <OrderCell
                                    key={`${item.Id}${i}`}
                                    productName={item.productName}
                                    productCode={item.productCode}
                                    style={{
                                        ...styles.listItem,
                                        ...styles.productCell,
                                        backgroundColor: getColorForCells(i),
                                        borderBottomColor: theme.dark ? color(theme.colors.background).lightness(25).hex() : '#e6e6e6',
                                    }} />
                            );
                        })}
                    </View>
                </ScrollView>
                <ScrollView
                    horizontal={true}
                    style={{ width: '70%', position: 'relative' }}
                    contentContainerStyle={{ flexDirection: 'columns' }}
                    ref={(scrollView) => {
                        setQuantitysView(scrollView);
                    }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEventThrottle={16}
                    onScroll={qtyOnScroll}
                    bounces={false}
                    testID="horizontal-scrollview-qty"
                >
                    {orders.map((item, index) => {
                        return (
                            <View key={index} style={{
                                ...styles.orderQtyCellBg,
                                backgroundColor: getColorForOrdersCells(index),
                                top: index * cellHeight,
                            }} />
                        )
                    })}
                    <View>
                        {orders.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View style={[styles.orderCellWrap, 
                                    { borderBottomColor: theme.dark ? color(theme.colors.background).lightness(25).hex() : '#e6e6e6' }]}>
                                        {dates.map((singleDate, i) => {
                                            let productQuantityByDate = getSummQtyByDate(singleDate, item.deliveries);
                                            return (
                                                <View
                                                    key={i}
                                                    style={{
                                                        ...styles.listItem,
                                                        width: 100,
                                                        paddingHorizontal: 10
                                                    }}
                                                >
                                                    <Cell content={productQuantityByDate || 0} style={[styles.orderCell, {
                                                        borderBottomColor: theme.dark ? color(theme.colors.background).lightness(40).hex() : '#a3a2a2'
                                                    }]} />
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
                <View style={{ width: '10%' }} testID="total-qty-container">
                    {orders.map((item, i) => {
                        return (
                            <View key={i} style={{ ...styles.quantityItem, backgroundColor: getColorForCells(i), }}>
                                <Cell content={item.totalProductQuantity} style={{
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingBottom: 5
                                }} />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', width: '100%', backgroundColor }}>
                <View
                    style={{
                        ...styles.listItem,
                        width: '20%',
                        alignItems: 'flex-end',
                        paddingEnd: 20,
                    }}
                >
                    <Text style={{ color: theme.colors.text }}>
                        {`${localized(`${NAMESPACE}order_total`, 'Total')} `}
                        {`${localized(`${NAMESPACE}oce__qty`, 'Qty')}`}
                    </Text>
                </View>
                <ScrollView
                    horizontal
                    style={{
                        flexDirection: 'row',
                        width: '70%',
                    }}
                    ref={(scrollView) => {
                        setTotalsView(scrollView);
                    }}
                    scrollEventThrottle={16}
                    onScroll={totalQtyOnScroll}
                    bounces={false}
                    testID="total-qty-scrollview"
                >
                    <View style={styles.totalQtyWrap}>
                        {dates.map((item, index) => <Cell key={index} content={item.quantity} style={styles.totalQty} />)}
                    </View>
                </ScrollView>
                <View style={{ width: '10%' }}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        height: cellHeight,
        justifyContent: 'center',
    },
    quantityItem: {
        width: '100%',
        height: cellHeight,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    header: {
        flexDirection: 'row',
    },
    productCell: {
        paddingStart: 20,
        borderBottomWidth: 1,
    },
    dateCellWrap: {
        height: cellHeight,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dateCell: {
        height: cellHeight,
        justifyContent: 'center',
        width: 100,
        borderEndWidth: 0.5,
        alignItems: 'center',
    },
    orderQtyCellBg: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: cellHeight,
    },
    orderCellWrap: {
        height: cellHeight,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 1
    },
    orderCell: {
        alignItems: 'center',
        borderBottomWidth: 1,
        width: '100%',
        paddingBottom: 5
    },
    totalQtyWrap: {
        height: cellHeight,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    totalQty: {
        height: cellHeight,
        justifyContent: 'center',
        width: 100,
        alignItems: 'center',
    }
});

export default OrdersTable;