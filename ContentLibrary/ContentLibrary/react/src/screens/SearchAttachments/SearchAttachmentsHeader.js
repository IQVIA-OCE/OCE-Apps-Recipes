import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { SegmentedControl, useTheme } from 'apollo-react-native';
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { setOwnershipFilter, setSearchText } from "../../store/SearchAttachmentsReducers";
import { OWNED_BY_ME, SHARED_WITH_ME } from "../../constants/constants";
import color from "color";

const SearchAttachmentsHeader = ({ navigation }) => {
    const theme = useTheme();
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(null);
    const dispatch = useDispatch();

    const { ownershipFilter, searchText } = useSelector(state => state.searchAttachmentsReducers);

    const handleBackButton = () => {
        dispatch(setSearchText(''));
        if (isSearchOpen) {
            setSearchOpen(false);
        } else {
            navigation.goBack(null);
        }
    }

    const inputMobileWrapperStyles = isSearchOpen ? { ...styles.inputContainer, width: 275 } : styles.inputContainer;
    const inputMobileStyles = isSearchOpen ? { ...styles.searchBarMobile, ...styles.searchBarMobileOpen } : styles.searchBarMobile;
    const segmentControlStyles = Platform.isPad ? styles.segmentControl : styles.segmentControlMobile;
    const segmentTextWrapperStyles = Platform.isPad ? styles.segmentViewItem : styles.segmentViewItemMobile;

    const segmentTextStyles = (ownership) => {
        const selectedColor = theme.dark ? theme.colors.primary : theme.colors.surface;

        return Platform.isPad ? {
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
                    {Platform.isPad && <Text style={[styles.text, {color: theme.colors.primary}]}>Back</Text>}
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
                    children={
                        <View style={segmentTextWrapperStyles}>
                            <Text style={segmentTextStyles(OWNED_BY_ME)}>Owned by me</Text>
                        </View>
                    } />
                <SegmentedControl
                    style={segmentControlStyles}
                    value={SHARED_WITH_ME}
                    children={
                        <View style={segmentTextWrapperStyles}>
                            <Text style={segmentTextStyles(SHARED_WITH_ME)}>Shared with me</Text>
                        </View>
                    } />
            </SegmentedControl.Row>
            {!Platform.isPad && (
                <TouchableWithoutFeedback testID="openSearchButton" onPress={() => {
                    setSearchOpen(true);
                    searchInput.focus()
                }}>
                    <Icon name="magnify" size={30} style={{color: theme.colors.primary}} />
                </TouchableWithoutFeedback>
            )}
            <View style={Platform.isPad ? { position: 'relative' } : inputMobileWrapperStyles}>
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
                    style={[Platform.isPad ? styles.searchBar : inputMobileStyles, {backgroundColor: theme.colors.surface, color: theme.colors.text}]} />
                <Icon name="magnify" size={30} style={styles.inputIcon} />
                {searchText ? <Icon name="close" size={30} style={styles.clearIcon} onPress={() => dispatch(setSearchText(''))} testID="clearButton"/> : null}
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
        color: '#6c6c6c'
    },
    clearIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        color: '#d6d6d5'
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
    segmentControl: {

    },
    segmentViewItemMobile: {
        height: 40
    },
    segmentViewItem: {

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
    }
});

export default withNavigation(SearchAttachmentsHeader);
