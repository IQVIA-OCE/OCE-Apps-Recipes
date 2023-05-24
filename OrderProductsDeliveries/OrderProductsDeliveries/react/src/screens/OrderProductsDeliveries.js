import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { environment } from 'oce-apps-bridges';
import { Header } from "../components/Header/Header";
import { OrdersTable } from "../components/OrdersTable/OrdersTable";
import { fetchOrderById } from "../api/OrderDetails";
import { fetchOrderDetailsAsync, setRecordId } from "../stores/orders";
import { _recordIdSelector, brandFilterSelector, searchProductValueSelector } from "../stores/ordersSelectors";
import useDebounce from "../utils/useDebounce";
import { View } from "react-native";
import { useTheme } from 'apollo-react-native';

const NAMESPACE = environment.namespace();

export const OrderProductsDeliveries = ( {recordId} ) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const _recordId = useSelector(_recordIdSelector);
    const searchProductValue = useSelector(searchProductValueSelector);
    const brandFilter = useSelector(brandFilterSelector);
    const debouncedSearchProductValue = useDebounce(searchProductValue, 500);

    const configureRecordId = async (id) => {
        try {
            const order = await fetchOrderById(id);
            if (order.totalSize > 0) {
                dispatch(setRecordId(order.records[0][`${NAMESPACE}Account__c`]))
            } else {
                dispatch(setRecordId(id))
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (recordId) {
            configureRecordId(recordId);
        }
    }, [recordId]);

    useEffect(() => {
        if (_recordId) dispatch(fetchOrderDetailsAsync(_recordId));
    }, [_recordId, debouncedSearchProductValue, brandFilter]);

    return (
        <View style={{ padding: 20, backgroundColor: theme.dark ? '#2c2c2f' : '#fff' }}>
            <Header recordId={_recordId}/>
            <OrdersTable />
        </View>
    );
};