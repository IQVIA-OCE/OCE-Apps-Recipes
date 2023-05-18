/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import color from 'color'

import { Provider, DonutChart, Menu, useTheme } from 'apollo-react-native';


const DonutChartContainer = ({ colorScheme, selectedProduct, shouldMenuClose }) => {

    const theme = useTheme();
    const [buttonX, setButtonX] = useState(0);
    const [buttonY, setButtonY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [product, setProduct] = useState(null);
    useEffect(() => {
        setProduct(selectedProduct?.details);
    }, [selectedProduct]);
    useEffect(() => {
        setIsMenuOpen(false);
    }, [shouldMenuClose])
    const closeMenu = () => {
        setIsMenuOpen(false)
    }
    const showMenu = () => {
        setIsMenuOpen(true)
    }
    const setLayout = useCallback(e => {
        setButtonX(e.nativeEvent.layout.width);
        setButtonY(e.nativeEvent.layout.height);
    })
    let value = 0;
    let minCallLimit = 0;
    let maxCallLimit = 0;
    let disbursed = 0;
    let remaining = 0;
    let quota = 0;
    if (product) {
        minCallLimit = product.minCallLimit;
        maxCallLimit = product.maxCallLimit;
        disbursed = product.disbursed;
        remaining = product.remaining;
        quota = product.quota;
        value = (disbursed * 100) / quota;
    }
    return (
        <View style={styles.childContainer}>
            <View style={styles.row} >
                <View style={styles.dataContainer}>
                    <View style={styles.col}>
                        <Text style={{ fontSize: 24, fontWeight: '500', lineHeight: 32, color: theme.colors.text }}>{selectedProduct?.label}</Text>
                    </View>
                    <View style={styles.col}>
                        <View style={styles.row}>
                            <View style={styles.donutChartContainer}>
                                <DonutChart
                                    colorScale={theme.dark ? [theme.colors.primary] : ['#4ba9c8']}
                                    subtitle={`${disbursed}/${quota}`}
                                    data={[{ name: 'Disbursed', value, tooltip: disbursed }]}
                                />
                                <View style={{ flexDirection: 'row', paddingTop: 30 }}>
                                    <View style={styles.rowCenter}>
                                        <View style={[styles.indicator, { backgroundColor: theme.dark ? theme.colors.primary : '#4ba9c8' }]}></View>
                                        <Text style={{ color: theme.colors.text }}>Disbursed</Text>
                                    </View>
                                    <View style={styles.rowCenter}>
                                        <View style={[styles.indicator, { backgroundColor: theme.dark ? color(theme.colors.surface).lighten(0.8).hex() : '#f3f3f3' }]}></View>
                                        <Text style={{ color: theme.colors.text }}>Remaining</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Provider theme={colorScheme}>
                                    <View>
                                        <TouchableOpacity onPress={showMenu} onLayout={setLayout}>
                                            <View style={styles.row}>
                                                <View style={[styles.moreContainer, {
                                                    backgroundColor: theme.dark ? theme.colors.background : '#e8e8e8',
                                                    borderWidth: theme.dark ? 1 : 0,
                                                    borderColor: theme.colors.placeholder
                                                }]} >
                                                    <View>
                                                        <View style={styles.dot}></View>
                                                        <View style={styles.dot}></View>
                                                        <View style={styles.dot}></View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <Menu
                                            visible={isMenuOpen}
                                            onDismiss={closeMenu}
                                            anchor={{ x: buttonX, y: buttonY }}
                                        >
                                            <Menu.Item title={`Min : ${minCallLimit}`} />
                                            <Menu.Item title={`Max : ${maxCallLimit}`} />
                                        </Menu>
                                    </View>
                                </Provider>
                            </View >
                        </View>
                    </View>
                    <View style={[styles.col, styles.childContainer]}>
                        <View style={styles.chartInfoContiner}>
                            <Text style={[styles.textInfo, { color: theme.colors.text }]}>Disbursed: {disbursed}</Text>
                            <Text style={[styles.textInfo, { color: theme.colors.text }]}>Remaining: {remaining}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View >
    )
}

export default DonutChartContainer;

const styles = StyleSheet.create({
    childContainer: {
        zIndex: -1
    },
    row: {
        flexDirection: 'row'
    },
    col: {
        flex: 0.33
    },
    dataContainer: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'row'
    },
    donutChartContainer: {
        alignItems: 'center',
        flex: 1
    },
    moreContainer: {
        marginTop: 10,
        width: 40,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dot: {
        width: 5,
        height: 5,
        backgroundColor: '#fff',
        borderRadius: 30,
        marginVertical: 1,
    },
    chartInfoContiner: {
        flex: 1,
        alignItems: 'center'
    },
    rowCenter: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 10
    },
    indicator: {
        width: 50, height: 30, marginRight: 5
    },
    textInfo: {
        fontSize: 16,
        fontWeight: '500'
    }
});
