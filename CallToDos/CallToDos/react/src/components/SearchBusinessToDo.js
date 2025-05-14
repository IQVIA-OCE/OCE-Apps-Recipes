import React, { useState , useContext, useEffect} from 'react';
import { Accordion, Button, Select, Chip, TextInput, Divider } from '@oce-apps/apollo-react-native';
import { ScrollView, StyleSheet, View, Alert, Platform} from 'react-native';
import { TableBusinessToDos } from './TableBusinessToDos';
import { TodoContext } from "../utils/context";

export const SearchBusinessToDo = () => {

    const [inputValue, setInputValue] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState('');
    const [chipFilter, setChipFilter] = useState([]);
    const [chipHeight, setChipHeight] = useState(100);
    const [key, setKey] = useState(0);
    const [chipRemoved, setChipRemoved] = useState(false);
    const {state,dispatch} = useContext(TodoContext);

    const fields = [
        { label: 'Name', value: 'Name' },
        { label: 'Products', value: 'OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c' },
        //{ label: 'Tactic', value: 'OCE__BusinessTactic__r.Name' },
        { label: 'Status', value: 'OCE__Status__c' }
    ];
    const [selectedField, setSelectedField] = useState(null);

    const operators = [
        { label: 'Equals', value: 'equal' },
        { label: 'Not Equals', value: 'notequal' },
        { label: 'Contains', value: 'like' },
        { label: 'Not Contains', value: 'notlike' }
    ];
    const [selectedOperator, setSelectedOperator] = useState(null);

    const clause = [
        { label: 'And', value: 'and' },
        { label: 'Or', value: 'or' }
    ];
    const [selectedClause, setSelectedClause] = useState(null);

    const HandleFilters = (val) => {
        setShowFilters(val);
    };

    const AddFilter = () => {
        if (selectedField == null)
        {
            return Alert.alert('Please set a field');
        }
        if (selectedOperator == null)
        {
            return Alert.alert('Please set an operator');
        }
        if (inputValue.length == 0)
        {
            return Alert.alert('Please set a value');
        }
        if (chipFilter.length > 0 && selectedClause== null)
        {
            return Alert.alert('Please set a clause');
        }
        let keyNum = key + 1;
        let titleText = `${selectedField.label} ${selectedOperator.label} ${inputValue}`;
        let filterText = '';
        switch (selectedOperator.value)
        {
            case "equal":
                filterText = `${selectedField.value} = '${inputValue}'`;
                break;
            case "notequal":
                filterText = `${selectedField.value} <> '${inputValue}'`;
                break;
            case "like":
                filterText = `${selectedField.value} like '%${inputValue}%'`;
                break;
            case "notlike":
                filterText = `not ${selectedField.value} like '%${inputValue}%'`;
                break;
        }
        filterText = ` or ` + filterText;
        if (chipFilter.length > 0)
        {
            titleText = ` ${selectedClause.label} ${selectedField.label} ${selectedOperator.label} ${inputValue}`;
            filterText = ` ${selectedClause.value} ` + filterText;
        }
        let addedChip = {
            key: keyNum,
            title: titleText,
            filter: filterText
        };
        setFilters(filters + filterText);
        if (filters.length >= 80)
        {
            setChipHeight(chipHeight + 100);
        }
        setKey(keyNum);
        setChipFilter([...chipFilter, addedChip]);
        dispatch(
            {
              type: "FILTER_BUSINESS_TO_DO",
              payload: filters + filterText
            }
        );
    };

    const setFiltersByDefault = () => {
        let keyNum = key;
        let titleText = "";
        let filterText = "";
        let filterToSet = "";
        let chipsToadd = [];
        let addedChip = {};
        if (state.productsDetailed.length > 0)
        {
            state.productsDetailed.forEach((node) => {
                ++keyNum;
                if (keyNum > 1)
                    titleText = `or Product Contains ${node}`;
                else
                    titleText = `Product Contains ${node}`;
                filterText = ` or OCE__BusinessTactic__r.OCE__BusinessObjective__r.OCE__Product__c like '%${node}%'`;
                addedChip = {
                    key: keyNum,
                    title: titleText,
                    filter: filterText
                };
                filterToSet += filterText;
                chipsToadd = [...chipsToadd, addedChip];
            });
            setKey(keyNum);
            setFilters(filterToSet);
            setChipFilter(chipsToadd);
            dispatch(
                {
                type: "FILTER_BUSINESS_TO_DO",
                payload: filterToSet
                }
            );
            dispatch(
                {
                type: "SET_DEFAULT_FILTER_BUSINESS_TO_DO",
                payload: false
                }
            );
        }
    }

    useEffect(() => {
        if (state.setDefaultFiltersBusinessToDo)
        {
            setFiltersByDefault();
        }
      }, [state]);

    useEffect(() => {
        if (chipRemoved)
        {
            let filterNew = chipFilter.map( (data, index) => {
                return `${data.filter}`
            }).join('');
            setFilters(filterNew);
            setChipRemoved(false);
            dispatch(
                {
                type: "FILTER_BUSINESS_TO_DO",
                payload: filterNew
                }
            );
        }
      }, [chipRemoved]);
    
    const HandleRemoveChip = (key) => {
        let result = chipFilter.filter( (data) => data.key !== key );
        setChipFilter(result);
        setChipRemoved(true);
    };
    
    let addedChipsComponents = chipFilter.map( (data, index) => {
        return (
            <View testID={`chipContainer_${data.key}`} key={data.key} style={styles.chipItem}>
                <Chip onClose={() => HandleRemoveChip(data.key)} >{data.title}</Chip>
            </View>
        )
    });

    const SearchToDoButton = () => {
        dispatch(
            {
              type: "SEARCH_BUSINESS_TO_DO",
              payload: true
            }
        );
    };
    
    return (
        <View style={[Platform.OS == 'web' ? styles.container : null]}>
            <ScrollView>
                { !showFilters &&
                <View>
                    <Button testID="hidden-filters" mode="contained" size="small" onPress={() => HandleFilters(true)} style={styles.buttonH}>Show Filters</Button>
                </View>
                }
                { showFilters &&
                    <View>
                        <Button testID="displayed-filters" mode="contained" size="small" onPress={() => HandleFilters(false)} style={styles.buttonH}>Hide Filters</Button>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{marginRight: 10, width: "20%"}} testID="select-field">
                                <Select
                                    label="Field"
                                    options={fields}
                                    value={selectedField}
                                    onChange={val => setSelectedField(val)}
                                    placeholder="Select field..."
                                    fullWidth={true}
                                />
                            </View>
                            <View style={{marginRight: 10, width: "20%"}} testID="select-operator">
                                <Select
                                    label="Operator"
                                    options={operators}
                                    value={selectedOperator}
                                    onChange={val => setSelectedOperator(val)}
                                    placeholder="Select operator..."
                                    fullWidth={true}
                                />
                            </View>
                            <TextInput
                                testID="input-text"
                                placeholder="..."
                                label="Value"
                                style={{marginRight: 10, width: "100%", maxWidth: 300}}
                                value={inputValue}
                                fullWidth={true}
                                onChangeText={text => setInputValue(text)}
                            />
                            <View style={{marginRight: 10, width: "10%"}} testID="select-clause">
                                <Select
                                    label="Clause"
                                    options={clause}
                                    value={selectedClause}
                                    onChange={val => setSelectedClause(val)}
                                    placeholder="Select clause..."
                                    fullWidth={true}
                                    disabled={chipFilter.length == 0}
                                />
                            </View>
                            <View style={{flex: 1, flexDirection: 'column'}}>
                                <Button testID="adding-filters" mode="contained" size="small" style={styles.buttonS} onPress={() => AddFilter()}>Add Filter</Button>
                                <Button testID="search-button" mode="contained" size="small" style={styles.buttonS} onPress={() => SearchToDoButton()}>Search</Button>
                            </View>
                        </View>
                        <Divider style={{marginTop: 10,  marginBottom: 10,}} />
                        <Accordion variant="alternate" defaultExpanded={true}>
                        <Accordion.Summary title="Filters"/>
                        <Accordion.Details>
                            <View testID="accordion-view" style={{flexDirection: 'row', alignContent: 'flex-start', flexWrap: 'wrap', height: chipHeight}}>
                                <View style={styles.chipItem}>
                                    
                                </View>
                                {addedChipsComponents}
                            </View>
                        </Accordion.Details>
                    </Accordion>
                    </View> 
                }
                <View>
                    <ScrollView>
                        <TableBusinessToDos></TableBusinessToDos>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    buttonH: {
        marginRight: 10,
        marginBottom: 10,
        width: '15%'
    },
    buttonS: {
        marginRight: 10,
        marginBottom: 10,
        width: '90%'
    },
    container: {
        flex: 1
    },
    chipItem: {
        marginBottom: 10,
    },
});