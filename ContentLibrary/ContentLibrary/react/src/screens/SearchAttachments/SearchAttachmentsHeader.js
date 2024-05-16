import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { SegmentedControl, useTheme } from '@oce-apps/apollo-react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { setOwnershipFilter, setSearchText } from "../../store/SearchAttachmentsReducers";
import { OWNED_BY_ME, SHARED_WITH_ME } from "../../constants/constants";
import color from "color";
import { useNavigation } from "@react-navigation/native";
import { isTablet } from '../../helpers';

const isPadOrWeb = isTablet() || Platform.OS === 'web';

const SearchAttachmentsHeader = () => {
    const theme = useTheme();
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { ownershipFilter, searchText } = useSelector(state => state.searchAttachmentsReducers);

    const handleBackButton = () => {
        dispatch(setSearchText(''));
        if (Platform.OS === 'web' || !isSearchOpen) {
            navigation.goBack(null);
        } else {
            setSearchOpen(false);
        }
    }

    const inputMobileWrapperStyles = isSearchOpen ? [styles.inputContainer, { width: 275 }] : styles.inputContainer;
    const inputMobileStyles = isSearchOpen ? [styles.searchBarMobile, styles.searchBarMobileOpen] : styles.searchBarMobile;
    const segmentControlStyles = isPadOrWeb && styles.segmentControlMobile;

    let inputWrapperStyles;
    let inputStyles;
    if (Platform.OS === 'web') {
        inputWrapperStyles = styles.inputContainerWeb;
        inputStyles = [styles.searchBarWeb, { backgroundColor: theme.colors.surface, color: theme.colors.text }];
    } else {
        inputWrapperStyles = isPadOrWeb ? { position: 'relative' } : inputMobileWrapperStyles;
        inputStyles = [isPadOrWeb ? styles.searchBar : inputMobileStyles, { backgroundColor: theme.colors.surface, color: theme.colors.text }];
    }

    const segmentTextStyles = (ownership) => {
        const selectedColor = theme.dark ? theme.colors.primary : theme.colors.surface;

        return isPadOrWeb ? {
            ...styles.segmentText,
            color: ownershipFilter === ownership ? selectedColor : theme.colors.text
        } : {
            ...styles.segmentTextMobile,
            color: ownershipFilter === ownership ? selectedColor : theme.colors.text
        }
    }

    const borderColor = color(theme.colors.background)
      .darken(0.08)
      .rgb()
      .string();

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background, borderColor: borderColor}]}>
            <TouchableOpacity style={styles.backContainer} onPress={handleBackButton} testID="headerBackButton">
                <>
                    <Icon name="chevron-left" size={40} style={[styles.backIcon, {color: theme.colors.primary}]} />
                    {isPadOrWeb && <Text style={[styles.text, {color: theme.colors.primary}]}>Back</Text>}
                </>
            </TouchableOpacity>
            <SegmentedControl.Row
                testID="segmentControl"
                onValueChange={v => v && dispatch(setOwnershipFilter(v))}
                value={ownershipFilter}
            >
                <SegmentedControl
                    style={segmentControlStyles}
                    value={OWNED_BY_ME}
                    children={<Text style={segmentTextStyles(OWNED_BY_ME)}>Owned by me</Text>} />
                <SegmentedControl
                    style={segmentControlStyles}
                    value={SHARED_WITH_ME}
                    children={<Text style={segmentTextStyles(SHARED_WITH_ME)}>Shared with me</Text>} />
            </SegmentedControl.Row>
            {!isTablet() && Platform.OS !== 'web' && (
                <TouchableWithoutFeedback testID="openSearchButton" onPress={() => {
                    setSearchOpen(true);
                    searchInput.focus()
                }}>
                    <Icon name="magnify" size={30} color={theme.colors.primary} />
                </TouchableWithoutFeedback>
            )}
            <View style={inputWrapperStyles}>
                <TextInput
                    ref={(ref) => {
                        setSearchInput(ref)
                    }}
                    testID="seatchInput"
                    placeholder="Search"
                    value={searchText}
                    onBlur={() => setSearchOpen(false)}
                    onChangeText={text => dispatch(setSearchText(text))}
                    placeholderTextColor={theme.colors.disabled}
                    style={inputStyles} />
                <View style={Platform.OS === 'web' ? styles.inputIconWeb : styles.inputIcon}>
                    <Icon name="magnify" size={30} color='#6c6c6c' />
                </View>
                {searchText ? (
                    <View style={Platform.OS === 'web' ? styles.clearIconWeb : styles.clearIcon}>
                        <Icon name="close" size={30} color='#6c6c6c' onPress={() => dispatch(setSearchText(''))} testID="clearButton"/>
                    </View>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        display: 'flex',
        flexWrap: 'nowrap',
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 5,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    backContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    inputContainer: {
        position: 'absolute',
        width: 0,
        top: 7,
        right: 7,
        overflow: 'hidden',
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    clearIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    inputIconWeb: {
        position: 'absolute',
        top: 4,
        left: 8,
    },
    clearIconWeb: {
        position: 'absolute',
        top: 4,
        right: 8,
    },
    searchBar: {
        position: 'relative',
        width: 220,
        borderRadius: 25,
        height: 45,
        backgroundColor: '#fff',
        paddingLeft: 40,
        fontSize: 16,
        borderColor: '#6c6c6c',
        borderWidth: 1,
    },
    searchBarMobile: {
        position: 'relative',
        width: 0,
        borderRadius: 25,
        height: 45,
        backgroundColor: '#fff',
        borderWidth: 0,
        paddingLeft: 40,
        fontSize: 16
    },
    searchBarMobileOpen: {
        width: '100%',
        borderColor: '#6c6c6c',
        backgroundColor: '#fff',
        borderWidth: 1,
    },
    segmentControlMobile: {
        height: 40,
        padding: 0,
        margin: 0
    },
    segmentViewItemMobile: {
        height: 40
    },
    segmentTextMobile: {
        width: 60,
        height: 40,
        textAlign: 'center',
        fontSize: 12,
    },
    segmentText: {
        paddingTop: 2,
        fontSize: 18,
    },
    backIcon: {
        color: '#3b92ff'
    },
    button: {
        width: 200,
        fontSize: 10,
        padding: 0
    },
    textWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        position: 'relative',
        left: -10,
        fontSize: 16,
        color: '#3b92ff'
    },
    segmentWrapperStyleWeb: {
        justifyContent: 'center',
        paddingBottom: 5
    },
    inputContainerWeb: {
        width: 250,
        flexDirection: 'row',
        position: 'relative'
    },
    searchBarWeb: {
        borderRadius: 25,
        paddingLeft: 40,
        position: 'relative',
        width: 250,
        height: 40,
        fontSize: 16,
        borderColor: '#6c6c6c',
        borderWidth: 1,
    },
});

export default SearchAttachmentsHeader;
