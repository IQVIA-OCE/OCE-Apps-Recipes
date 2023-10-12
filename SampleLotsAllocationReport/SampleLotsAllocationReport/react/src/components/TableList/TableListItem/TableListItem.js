import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { navigator } from "oce-apps-bridges";
import { neutral01, Text, themePrimary, secondaryOrange, useTheme } from 'apollo-react-native';
import color from 'color'
import { formatDate } from '../../../utils/dateTimeFormat'
import { TableListChildItem } from '../TableListChildItem/TableListChildItem'

export const TableListItem = ({ tableData, dataObj, isParent, index, tableHeaders, onRowPress }) => {
    const theme = useTheme();
    const { dark, colors } = theme;
    let backgroundColor = dataObj?.isGrouped ? themePrimary[50] : neutral01[700];
    if (index % 2 !== 1 && !dataObj?.isGrouped) {
        backgroundColor = 'white';
    }
    if (dark) {
        backgroundColor = colors.background;
    }
    let childTableRowBg = dark ? color(theme.colors.surface).darken(0.5).hex() : neutral01[700];
    if (index % 2 !== 1) {
        childTableRowBg = dark ? color(theme.colors.surface).darken(0.1).hex() : 'white';
    }
    const onNavigateLink = async (sObject, id) => {
        try {
            await navigator.navigate({}, sObject, id, 'present', 'view')
        } catch (error) {

            throw error;
        }
    }
    const renderCells = (field, key) => {
        if (typeof tableData[field] === 'object' && !tableData[field]?.type) {
            return (
                <TouchableOpacity testID={`deepLinkFields_${key}`} key={key} style={[styles.cell, { borderRightColor: dark ? color(theme.colors.surface).lighten(0.5).hex() : 'white' }]} onPress={() => onNavigateLink(tableData[field].sObject, tableData[field].value)} >
                    <Text numberOfLines={2} style={styles.link} >{tableData[field].name}</Text>
                </TouchableOpacity>
            )
        }
        let columnVal = tableData[field];
        if (tableData[field]?.type === 'date') {
            columnVal = formatDate(tableData[field].value);
        }
        return (
            <View key={key} style={[styles.cell, { borderRightColor: dark ? color(theme.colors.surface).lighten(0.5).hex() : 'white' }]}>
                <Text numberOfLines={2}>{columnVal}</Text>
            </View>
        )

    }
    if (isParent) {
        return (
            <View testID='tableListItem'>
                <View style={[styles.row, { backgroundColor }]}>
                    {tableData.map((field, key) => (
                        <View key={key} style={[styles.cell, { borderRightColor: dark ? color(theme.colors.surface).lighten(0.5).hex() : 'white' }]}>
                            <Text numberOfLines={2}>{field}</Text>
                        </View>
                    ))}
                </View>
                {dataObj?.isGrouped &&
                    <View>
                        <Text style={[styles.errorMessage, { backgroundColor: dark ? color(theme.colors.surface).lighten(1).hex() : secondaryOrange[50] }]}>{`Total Number of Records:  ${dataObj.childRows.length}`}</Text>
                        <FlatList
                            data={dataObj.childRows}
                            renderItem={({ item, index }) => <TableListChildItem onRowPress={() => onRowPress(item)} data={item} index={index} tableHeaders={tableHeaders} />}
                            keyExtractor={(item, index) => index}
                        />
                    </View>
                }
            </View >
        );
    }
    return (
        <View testID='tableListItem'>
            <View style={[styles.row, { backgroundColor: childTableRowBg }]}>
                {Object.keys(tableData).map((field, index) => (
                    renderCells(field, index)
                ))}
            </View>
        </View >
    );

};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
    },
    cell: {
        flex: 1,
        borderRightWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: '100%'
    },

    errorMessage: {
        padding: 5,
        marginBottom: 10,
    },
    link: {
        color: themePrimary[500]
    }
});
