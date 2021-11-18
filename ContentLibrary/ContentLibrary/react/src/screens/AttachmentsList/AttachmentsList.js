import React, { useEffect } from "react";
import { View, FlatList, Platform, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteAttachmentByLinkedEntityId, getAttachmentsByLinkedEntityId, getAttachmentsFromLocalAsync } from "../../api/Attachments";
import { deleteAttachment, setAttachmentsList, setError, setLoading, setLocalAttachmentsList } from "../../store/AttachmentsListReducers";
import { normalizeAttachmentsByOrders } from "../../utils/utils";
import AttachmentItemMobile from "./AttachmentItemMobile";
import AttachmentItemPad from "./AttachmentsItemPad";
import { ApolloProgress } from 'apollo-react-native';
import { fileViewerBridge } from '../../../bridge/FileViewer/FileViewerBridge.native';
import { NO_CONNECTION } from "../../constants/constants";
import { ErrorView, NoConnectionView } from "../../components";

const AttachmentsList = () => {
    const dispatch = useDispatch();
    const { attachmentsList, recordId, error, loading, connectionStatus } = useSelector(state => state.attachmentsListReducers);

    const handleDelete = async (documentId) => {
        try {
            await deleteAttachmentByLinkedEntityId(documentId);
            dispatch(deleteAttachment(documentId));
        } catch (e) {
            console.log('error', e);
        }
    }

    const handleOpen = async (Id) => {
        try {
            await fileViewerBridge.viewAttachment(Id);
        } catch (e) {
            alert('Something gone wrong or file does not exist.')
        }
    }

    const getAttachments = async (localAttachments) => {
        dispatch(setLoading(true));
        try {
            let response = await getAttachmentsByLinkedEntityId(recordId);
            if (error) dispatch(setError(false));
            dispatch(setAttachmentsList(normalizeAttachmentsByOrders(response, localAttachments)));
        } catch (e) {
            console.log('Error while fetching attachments', e);
            dispatch(setError(true));
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getAttachmentsFromLocal = async () => {
        let records = [];
        try {
            const response = await getAttachmentsFromLocalAsync(recordId);
            records = response.records;
            dispatch(setLocalAttachmentsList(records));
        } catch (e) {
            console.log(e);
        }
        return records;
    }

    useEffect(() => {
        async function getData() {
            getAttachments(await getAttachmentsFromLocal());
        }
        if (recordId) {
            getData();
        }
    }, [recordId]);

    if (error) {
        return <ErrorView />;
    }

    const noConnection = connectionStatus?.currentStatus === NO_CONNECTION;

    return (
        <View style={{ marginTop: 10 }}>
            {loading ? (
                <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }} testID="loading-view">
                    <ApolloProgress />
                </View>
            ) : (
                <FlatList
                    data={attachmentsList}
                    renderItem={(el) => Platform.isPad ?
                        <AttachmentItemPad attachment={el} handleDelete={handleDelete} handleOpen={handleOpen} />
                        : <AttachmentItemMobile attachment={el} handleDelete={handleDelete} handleOpen={handleOpen} />}
                    keyExtractor={item => item.Id}
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

export default AttachmentsList;
