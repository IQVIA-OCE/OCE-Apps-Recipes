import { OWNED_BY_ME, SHARED_WITH_ME } from '../constants/constants';
import reducer, {
    setSearchAttachmentsOwnedByMe, setSearchAttachmentsSharedWithMe,
    setOwnershipFilter, setLoading, setError, setSearchText,
    setSearchAttachmentAdded
} from './SearchAttachmentsReducers';

const initialState = {
    searchAttachmentsListOwnedByMe: [],
    searchAttachmentsListSharedWithMe: [],
    loading: false,
    error: false,
    ownershipFilter: OWNED_BY_ME,
    searchText: ''
};

test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('should handle error state', () => {
    const previousState = initialState;
    expect(reducer(previousState, setError(true))).toEqual({
        searchAttachmentsListOwnedByMe: [],
        searchAttachmentsListSharedWithMe: [],
        loading: false,
        error: true,
        ownershipFilter: OWNED_BY_ME,
        searchText: ''
    });
});

test('should handle loading state', () => {
    const previousState = initialState;
    expect(reducer(previousState, setLoading(true))).toEqual({
        searchAttachmentsListOwnedByMe: [],
        searchAttachmentsListSharedWithMe: [],
        loading: true,
        error: false,
        ownershipFilter: OWNED_BY_ME,
        searchText: ''
    });
});

test('should set ownershipFilter', () => {
    const previousState = initialState;
    expect(reducer(previousState, setOwnershipFilter(SHARED_WITH_ME))).toEqual({
        searchAttachmentsListOwnedByMe: [],
        searchAttachmentsListSharedWithMe: [],
        loading: false,
        error: false,
        ownershipFilter: SHARED_WITH_ME,
        searchText: ''
    });
});

test('should set searchText', () => {
    const previousState = initialState;
    expect(reducer(previousState, setSearchText("test"))).toEqual({
        searchAttachmentsListOwnedByMe: [],
        searchAttachmentsListSharedWithMe: [],
        loading: false,
        error: false,
        ownershipFilter: OWNED_BY_ME,
        searchText: 'test'
    });
});

test('should set searchAttachmentsOwnedByMe', () => {
    const previousState = initialState;
    expect(reducer(previousState, setSearchAttachmentsOwnedByMe([{ Id: '123', Title: 'Picture' }]))).toEqual({
        searchAttachmentsListOwnedByMe: [{ Id: '123', Title: 'Picture' }],
        searchAttachmentsListSharedWithMe: [],
        loading: false,
        error: false,
        ownershipFilter: OWNED_BY_ME,
        searchText: ''
    });
});

test('should set searchAttachmentsSharedWithMe', () => {
    const previousState = initialState;
    expect(reducer(previousState, setSearchAttachmentsSharedWithMe([{ Id: '123', Title: 'Picture' }]))).toEqual({
        searchAttachmentsListOwnedByMe: [],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
        loading: false,
        error: false,
        ownershipFilter: OWNED_BY_ME,
        searchText: ''
    });
});

test('should set searchAttachmentAdded owned by me', () => {
    const previousState = {
        ...initialState,
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File'}],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
    };
    expect(reducer(previousState, setSearchAttachmentAdded('987'))).toEqual({
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File', Added: true }],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
        loading: false,
        error: false,
        ownershipFilter: OWNED_BY_ME,
        searchText: ''
    });
});

test('should set searchAttachmentAdded shared with me', () => {
    const previousState = {
        ...initialState,
        ownershipFilter: SHARED_WITH_ME,
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File'}],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
    };
    expect(reducer(previousState, setSearchAttachmentAdded('123'))).toEqual({
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File' }],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture', Added: true }],
        loading: false,
        error: false,
        ownershipFilter: SHARED_WITH_ME,
        searchText: ''
    });
});

test('should set searchAttachmentAdded owned by me without Added', () => {
    const previousState = {
        ...initialState,
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File'}],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
    };
    expect(reducer(previousState, setSearchAttachmentAdded('555'))).toEqual({
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File' }],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
        loading: false,
        error: false,
        ownershipFilter: OWNED_BY_ME,
        searchText: ''
    });
});

test('should set searchAttachmentAdded shared with me', () => {
    const previousState = {
        ...initialState,
        ownershipFilter: SHARED_WITH_ME,
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File'}],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
    };
    expect(reducer(previousState, setSearchAttachmentAdded('555'))).toEqual({
        searchAttachmentsListOwnedByMe: [{ Id: '987', Title: 'File' }],
        searchAttachmentsListSharedWithMe: [{ Id: '123', Title: 'Picture' }],
        loading: false,
        error: false,
        ownershipFilter: SHARED_WITH_ME,
        searchText: ''
    });
});