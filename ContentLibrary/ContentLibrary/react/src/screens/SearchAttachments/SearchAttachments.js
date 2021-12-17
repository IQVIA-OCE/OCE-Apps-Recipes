import React, { useCallback, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAttachmentsForSearchOwnedByMe, getAttachmentForSearchSharedWithMe, addAttachmentAsync } from "../../api/SearchAttachments";
import {
    setError,
    setLoading,
    setSearchAttachmentsOwnedByMe,
    setSearchAttachmentsSharedWithMe,
    setSearchAttachmentAdded
} from "../../store/SearchAttachmentsReducers";
import SearchAttachmentItem from "./SearchAttachmentsItem";
import { environment } from '../../../bridge/EnvironmentData/EnvironmentData.native';
import { NO_CONNECTION, OWNED_BY_ME } from "../../constants/constants";
import { ApolloProgress } from "apollo-react-native/lib/module";
import { normalizeAttachmentsByOrders, normalizeSearchAttachmentOwnedByMe, normalizeSearchAttachmentSharedWithMe } from "../../utils/utils";
import useDebounce from "../../hooks/useDebounce";
import { getAttachmentsByLinkedEntityId } from "../../api/Attachments";
import { setAttachmentsList } from "../../store/AttachmentsListReducers";
import { ErrorView, NoConnectionView } from "../../components";

const SearchAttachments = () => {
    const dispatch = useDispatch();

    const {
        ownershipFilter,
        searchText, error, loading,
        searchAttachmentsListOwnedByMe, searchAttachmentsListSharedWithMe } = useSelector(state => state.searchAttachmentsReducers);

    const { attachmentsList, recordId, localAttachmentsList, connectionStatus } = useSelector(state => state.attachmentsListReducers);

    const debouncedSearch = useDebounce(searchText, 500);

    const addAttachment = async (documentId) => {
        try {
            await addAttachmentAsync(documentId, recordId);
            const response = await getAttachmentsByLinkedEntityId(recordId);
            dispatch(setAttachmentsList(normalizeAttachmentsByOrders(response, localAttachmentsList)));
            dispatch(setSearchAttachmentAdded(documentId));
        } catch (e) {
            console.log('error adding attachment', e);
        }
    }

    const getSearchAttachments = async () => {
        dispatch(setLoading(true));
        try {
            let responseOwnedByMe = await getAttachmentsForSearchOwnedByMe(environment.userID(), searchText);
            let responseSharedWithMe = await getAttachmentForSearchSharedWithMe(environment.userID(), searchText);

            if (error) dispatch(setError(false));

            dispatch(setSearchAttachmentsOwnedByMe(normalizeSearchAttachmentOwnedByMe(responseOwnedByMe, attachmentsList)));
            dispatch(setSearchAttachmentsSharedWithMe(normalizeSearchAttachmentSharedWithMe(responseSharedWithMe, attachmentsList)));

        } catch (e) {
            console.log('Error while fetching attachments', e);
            dispatch(setError(true));
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        getSearchAttachments();
    }, [debouncedSearch]);

    if (error) {
        return <ErrorView />;
    }

    const list = ownershipFilter === OWNED_BY_ME ? searchAttachmentsListOwnedByMe : searchAttachmentsListSharedWithMe;
    const noConnection = connectionStatus?.currentStatus === NO_CONNECTION;

    return (
        <View style={{ marginTop: 20 }}>
            {loading ? (
                <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }} testID="loading-view">
                    <ApolloProgress />
                </View>
            ) : (
                <FlatList
                    data={list}
                    renderItem={(attachment) => <SearchAttachmentItem attachment={attachment} addAttachment={addAttachment} />}
                    keyExtractor={(item) => item.Id}
                    extraData={ownershipFilter}
                    removeClippedSubviews={true}
                    windowSize={5}
                    ListHeaderComponent={() => noConnection ? <NoConnectionView /> : null}
                    ListEmptyComponent={() => !noConnection && (
                        <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }} testID="emptyView">
                            <Text>No data found</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default SearchAttachments;
