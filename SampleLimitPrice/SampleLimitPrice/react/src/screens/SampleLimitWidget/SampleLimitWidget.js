/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { Divider, Headline, Title, Autocomplete, useTheme } from 'apollo-react-native';
import color from 'color'
import DonutChartContainer from '../../components/DonutChartContainer'
import { fetchActivityPlan, fetchAccounts } from '../../api/activityPlanApi';
import { mapProducts, mapAccounts } from '../../utils'
import CustomAutoComplete from '../../components/CustomAutoComplete'

const SampleLimitWidget = ({ colorScheme, accountId }) => {
    const theme = useTheme();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isAccountListVisible, setAccountListVisible] = useState(false);
    const [shouldMenuClose, setShouldMenuClose] = useState(false);
    const [accounts, setAccounts] = useState([{ label: 'Select', value: '' }]);
    const [defaultVal, setDefault] = useState(null);
    useEffect(() => {
        fetchProductData();
        fetchAccountData();
    }, [])
    const fetchProductData = async () => {
        try {
            const products = await fetchActivityPlan();
            const filterdProducts = mapProducts(products.records);
            setProducts(filterdProducts);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        let productsForAccounts = products;
        if (accountId) {
            productsForAccounts = products.filter((products) => products.value === accountId);
        }
        setFilteredProducts(productsForAccounts);
    }, [products])

    const fetchAccountData = async () => {
        try {
            const accounts = await fetchAccounts(accountId);
            const filteredAccounts = mapAccounts(accounts.records);
            setAccounts(filteredAccounts);
            const defaultAccount = filteredAccounts.filter((account) => account.value === accountId);
            setDefault(defaultAccount[0]);

        } catch (err) {
            console.log(err);
        }
    }
    const searchItemByQuery = async (text) => {
        const accounts = await fetchAccounts(text);
        const filteredAccounts = mapAccounts(accounts.records);
        setAccounts(filteredAccounts);
    }
    const dismissAutoComplete = (val) => {
        setAccountListVisible(val);
        setShouldMenuClose(!shouldMenuClose);
    }
    const onSelectItem = (item) => {
        setDefault(item);
        let productsForAccounts = products;
        if (item) {
            productsForAccounts = products.filter((products) => products.value === item.value)
        }
        if (item?.value !== selectedProduct?.value) setSelectedProduct({ value: null });
        setFilteredProducts(productsForAccounts);
    }

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => dismissAutoComplete(false)}>
            <View style={{ backgroundColor: theme.dark ? theme.colors.background : color(theme.colors.background).lighten(1).hex(), flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.titleContiner}>
                        <Headline>Sample Limits per Call</Headline>
                        <Title style={styles.selectContainer}>{defaultVal?.label}</Title>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.selectContainer}>
                            <Autocomplete
                                label="Product List"
                                placeholder={selectedProduct?.value ? '' : 'Select Product…'}
                                source={filteredProducts}
                                onChange={val => setSelectedProduct(val)}
                                search
                                singleSelect
                                singleSelectValue={selectedProduct}
                            />
                        </View>
                        <View style={styles.selectContainer}>
                            <CustomAutoComplete label={'Accounts'}
                                data={accounts}
                                isVisible={isAccountListVisible}
                                searchItemByQuery={searchItemByQuery}
                                toggleListActive={dismissAutoComplete}
                                onSelectItem={onSelectItem}
                                defaultVal={defaultVal}
                            />
                        </View>

                    </View>
                    <Divider type="axis" style={styles.divider} />
                    <DonutChartContainer colorScheme={colorScheme} selectedProduct={selectedProduct} shouldMenuClose={shouldMenuClose} />
                </View>
            </View>
        </TouchableWithoutFeedback>
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
    selectContainer: {
        marginTop: 20,
        width: 350,
        marginBottom: 20,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        alignItems: 'flex-start'
    },
    divider: {
        marginTop: 20,
        zIndex: -1
    }
});
