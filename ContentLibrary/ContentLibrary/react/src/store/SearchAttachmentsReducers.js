import { createSlice } from '@reduxjs/toolkit';
import { OWNED_BY_ME } from '../constants/constants';

const initialState = {
    searchAttachmentsListOwnedByMe: [],
    searchAttachmentsListSharedWithMe: [],
    loading: false,
    error: false,
    ownershipFilter: OWNED_BY_ME,
    searchText: ''
};

const slice = createSlice({
    name: 'searchAttachments',
    initialState,
    reducers: {
        setSearchAttachmentsOwnedByMe: (state, action) =>
            Object.assign({}, state, {
                searchAttachmentsListOwnedByMe: action.payload,
            }),
        setSearchAttachmentsSharedWithMe: (state, action) =>
            Object.assign({}, state, {
                searchAttachmentsListSharedWithMe: action.payload,
            }),
        setSearchAttachmentAdded: (state, action) => {
            if (state.ownershipFilter === OWNED_BY_ME) {
                return Object.assign({}, state, {
                    searchAttachmentsListOwnedByMe: state.searchAttachmentsListOwnedByMe.map(i => {
                        if (i.Id === action.payload) return { ...i, Added: true };
                        return i;
                    }),
                })
            } else {
                return Object.assign({}, state, {
                    searchAttachmentsListSharedWithMe: state.searchAttachmentsListSharedWithMe.map(i => {
                        if (i.Id === action.payload) return { ...i, Added: true };
                        return i;
                    }),
                })
            }
        },
        setOwnershipFilter: (state, action) =>
            Object.assign({}, state, {
                ownershipFilter: action.payload,
            }),
        setLoading: (state, action) =>
            Object.assign({}, state, {
                loading: action.payload,
            }),
        setError: (state, action) =>
            Object.assign({}, state, {
                error: action.payload,
            }),
        setSearchText: (state, action) =>
            Object.assign({}, state, {
                searchText: action.payload,
            }),
    }
});

export default slice.reducer;

export const { setSearchAttachmentsOwnedByMe, setSearchAttachmentsSharedWithMe,
    setOwnershipFilter, setLoading, setError, setSearchText, 
    setSearchAttachmentAdded
} = slice.actions;
