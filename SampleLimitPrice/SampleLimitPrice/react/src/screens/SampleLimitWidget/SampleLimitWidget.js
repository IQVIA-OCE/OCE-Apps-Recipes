/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { Divider, Autocomplete, useTheme, ApolloProgress } from '@oce-apps/apollo-react-native';
import color from 'color'
import DonutChartContainer from '../../components/DonutChartContainer'
import { fetchAllActivityPlans, fetchAccounts } from '../../api/activityPlanApi';
import { mapProducts, mapAccounts, mapAccountProducts } from '../../utils';

const SampleLimitWidget = ({ colorScheme, accountId }) => {
    const theme = useTheme();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [shouldMenuClose, setShouldMenuClose] = useState(false);
    const [accounts, setAccounts] = useState([{ label: 'Select', value: '' }]);
    const [defaultVal, setDefault] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        try {
            setIsLoading(true);
            await fetchProductData();
            await fetchAccountData();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    }
    const fetchProductData = async () => {
        try {
            const products = await fetchAllActivityPlans();
            const filterdProducts = products ? mapAccountProducts(products) : [];
            setProducts(filterdProducts);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        let productsForAccounts = products;
        if (accountId) {
            productsForAccounts = products.filter((products) => products.accountId === accountId);
        }
        const mappedProducts = productsForAccounts ? mapProducts(productsForAccounts) : [];
        setFilteredProducts(mappedProducts);
    }, [products])

    const fetchAccountData = async () => {
        try {
            const accounts = await fetchAccounts(accountId);
            const filteredAccounts = accounts ? mapAccounts(accounts) : [];
            setAccounts(filteredAccounts);
            const defaultAccount = filteredAccounts.filter((account) => account.value === accountId);
            setDefault(defaultAccount[0]);
        } catch (err) {
            console.log(err);
        }
    }
    const dismissAutoComplete = (val) => {
        setShouldMenuClose(!shouldMenuClose);
    }
    const onSelectItem = (item) => {
        setDefault(item);
        let productsForAccounts = products;
        if (item) {
            productsForAccounts = products.filter((products) => products.accountId === item.value)
        }
        if (item?.value !== selectedProduct?.value) setSelectedProduct({ value: null });
        const mappedProducts = mapProducts(productsForAccounts);
        setFilteredProducts(mappedProducts);
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => dismissAutoComplete(false)}>
                <View style={{ backgroundColor: theme.dark ? theme.colors.background : color(theme.colors.background).lighten(1).hex(), flex: 1 }}>
                    {isLoading && <ApolloProgress style={[styles.loader, {
                        backgroundColor: theme.dark
                            ? color(theme.colors.placeholder).darken(0.1).hex()
                            : color(theme.colors.background).lighten(0.1).hex()
                    }]} testID="loader-wrap" />}
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <Text style={{ fontWeight: '500', fontSize: 24, lineHeight: 32, flex: 1, color: theme.colors.text }}>Sample Limits per Call</Text>
                            <Text style={{ fontWeight: '500', fontSize: 20, lineHeight: 30, flex: 1, maxWidth: 350, color: theme.colors.text }}>{defaultVal?.label}</Text>
                        </View>
                        <View style={styles.row}>
                            <Autocomplete
                                style={styles.selectContainer}
                                label="Product List"
                                placeholder={selectedProduct?.value ? '' : 'Select Product…'}
                                source={filteredProducts}
                                onChange={val => setSelectedProduct(val)}
                                search
                                singleSelect
                                singleSelectValue={selectedProduct}
                            />
                            <Autocomplete
                                style={styles.selectContainer}
                                label="Accounts"
                                placeholder={defaultVal?.value ? '' : 'Select Account...'}
                                source={accounts}
                                onChange={val => onSelectItem(val)}
                                search
                                singleSelect
                                singleSelectValue={defaultVal}
                            />
                        </View>
                        <Divider type="axis" style={styles.divider} />
                        <View>
                            <DonutChartContainer colorScheme={colorScheme} selectedProduct={selectedProduct} shouldMenuClose={shouldMenuClose} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default SampleLimitWidget;

const styles = StyleSheet.create({
    container: {
        margin: 20

    },
    titleContiner: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    title: {
        fontWeight: '500', fontSize: 24, lineHeight: 32, flex: 1,
    },
    accountLabel: {
        fontWeight: '500', fontSize: 20, lineHeight: 30, flex: 1, maxWidth: 350
    },
    selectContainer: {
        marginTop: 20,
        marginBottom: 20,
        flex: 1,
        maxWidth: 350
    },
    accountText: {
        fontSize: 16, fontWeight: '700'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    divider: {
        marginTop: 20,
        zIndex: -1
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        zIndex: 10,
    },
});
