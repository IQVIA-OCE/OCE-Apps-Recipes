import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Cell from './Cell';
import OrderCell from './OrderCell';
import { getDatesFromOrders, getSummQtyByDate } from './helpers';
import { ApolloProgress } from 'apollo-react-native';
import { localized, environment } from 'oce-apps-bridges';

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

    if (isLoading) return (
        <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }} testID="loading-view">
            <ApolloProgress />
        </View>
    )

    if (!orders?.length) return (
        <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }}>
            <Text>No data found</Text>
        </View>
    );

    if (dates.length === 0) return null;

    return (
        <View style={{ height: 400 }} testID="table-container">
            <View style={styles.header}>
                <View style={{ ...styles.listItem, width: '20%', padding: 10 }} testID="product-name-th">
                    <Text style={styles.columnTitle}>Product Name/Code</Text>
                </View>
                <View style={{ ...styles.listItem, width: '70%' }}>
                    <ScrollView
                        horizontal
                        scrollEventThrottle={16}
                        ref={(scrollView) => {
                            setDatesView(scrollView);
                        }}
                        style={{ width: '100%', backgroundColor: '#f3f3f4' }}
                        onScroll={datesOnScroll}
                        bounces={false}
                        testID="dates-th-scrollview"
                    >
                        <View style={styles.dateCellWrap}>
                            {dates.map((item, index) => {
                                return (
                                    <Cell key={index} content={item.date} style={styles.dateCell} />
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
                <View style={{ ...styles.listItem, width: '10%', alignItems: 'center' }} testID="total-qty-th">
                    <Text style={styles.columnTitle}>
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
                <ScrollView horizontal style={{ width: '20%' }}>
                    <View>
                        {orders.map((item, i) => {
                            return (
                                <OrderCell
                                    key={item.productCode}
                                    productName={item.productName}
                                    productCode={item.productCode}
                                    style={{
                                        ...styles.listItem,
                                        ...styles.productCell,
                                        backgroundColor: i % 2 === 0 ? '#f3f3f4' : '#f9fafb',
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
                                backgroundColor: index % 2 === 0 ? '#f9fafb' : '#feffff',
                                top: index * cellHeight,
                            }} />
                        )
                    })}
                    <View>
                        {orders.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View style={styles.orderCellWrap}>
                                        {dates.map((singleDate, i) => {
                                            let productQuantityByDate = getSummQtyByDate(item.deliveries, singleDate);
                                            return (
                                                <View
                                                    key={i}
                                                    style={{
                                                        ...styles.listItem,
                                                        width: 100,
                                                        paddingHorizontal: 10
                                                    }}
                                                >
                                                    <Cell content={productQuantityByDate || 0} style={styles.orderCell} />
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
                            <View key={i} style={{ ...styles.quantityItem, backgroundColor: i % 2 === 0 ? '#f3f3f4' : '#f9fafb' }}>
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
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View
                    style={{
                        ...styles.listItem,
                        width: '20%',
                        alignItems: 'flex-end',
                        paddingEnd: 20,
                    }}
                >
                    <Text style={styles.columnTitle}>
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
    columnTitle: {
        color: '#676767'
    },
    productCell: {
        paddingStart: 20,
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1,
    },
    dateCellWrap: {
        height: cellHeight,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f3f3f4',
    },
    dateCell: {
        height: cellHeight,
        justifyContent: 'center',
        width: 100,
        borderEndWidth: 0.5,
        borderEndColor: '#E6E6E6',
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
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1
    },
    orderCell: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#a3a2a2',
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
        backgroundColor: '#fff',
        height: cellHeight,
        justifyContent: 'center',
        width: 100,
        alignItems: 'center',
    }
});

export default OrdersTable;