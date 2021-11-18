import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    attachmentsList: [],
    localAttachmentsList: [],
    loading: false,
    error: false,
    recordId: null,
    connectionStatus: null
};

const slice = createSlice({
    name: 'attachmentsList',
    initialState,
    reducers: {
        setAttachmentsList: (state, action) =>
            Object.assign({}, state, {
                attachmentsList: action.payload,
            }),
        setLocalAttachmentsList: (state, action) =>
            Object.assign({}, state, {
                localAttachmentsList: action.payload,
            }),
        deleteAttachment: (state, action) =>
            Object.assign({}, state, {
                attachmentsList: state.attachmentsList.filter(i => i.Id !== action.payload),
            }),
        setLoading: (state, action) =>
            Object.assign({}, state, {
                loading: action.payload,
            }),
        setError: (state, action) =>
            Object.assign({}, state, {
                error: action.payload,
            }),
        setRecordId: (state, action) =>
            Object.assign({}, state, {
                recordId: action.payload,
            }),
        setConnectionStatus: (state, action) =>
            Object.assign({}, state, {
                connectionStatus: action.payload,
            }),
    }
});

export default slice.reducer;

export const { setAttachmentsList, setLoading, setError, setRecordId, deleteAttachment, 
    setLocalAttachmentsList, setConnectionStatus } = slice.actions;
