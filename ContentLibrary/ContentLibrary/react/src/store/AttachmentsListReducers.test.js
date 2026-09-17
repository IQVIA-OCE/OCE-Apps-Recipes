import reducer, {
    setAttachmentsList,
    setLoading,
    setError,
    setRecordId,
    deleteAttachment,
    setLocalAttachmentsList
} from './AttachmentsListReducers';

const initialState = {
    attachmentsList: [],
    localAttachmentsList: [],
    loading: false,
    error: false,
    recordId: null,
    connectionStatus: null
};

test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('should handle error state', () => {
    const previousState = initialState;
    expect(reducer(previousState, setError(true))).toEqual({
        attachmentsList: [],
        localAttachmentsList: [],
        loading: false,
        error: true,
        recordId: null,
        connectionStatus: null
    });
});

test('should handle loading state', () => {
    const previousState = initialState;
    expect(reducer(previousState, setLoading(true))).toEqual({
        attachmentsList: [],
        localAttachmentsList: [],
        loading: true,
        error: false,
        recordId: null,
        connectionStatus: null
    });
});

test('should set recordId', () => {
    const previousState = initialState;
    expect(reducer(previousState, setRecordId('123'))).toEqual({
        attachmentsList: [],
        localAttachmentsList: [],
        loading: false,
        error: false,
        recordId: '123',
        connectionStatus: null
    });
});

test('should set attachmentsList', () => {
    const previousState = initialState;
    expect(reducer(previousState, setAttachmentsList([{ Id: '123', Title: 'Picture' }]))).toEqual({
        attachmentsList: [{ Id: '123', Title: 'Picture' }],
        localAttachmentsList: [],
        loading: false,
        error: false,
        recordId: null,
        connectionStatus: null
    });
});

test('should set localAttachmentsList', () => {
    const previousState = initialState;
    expect(reducer(previousState, setLocalAttachmentsList([{ Id: '123', Title: 'Picture' }]))).toEqual({
        attachmentsList: [],
        localAttachmentsList: [{ Id: '123', Title: 'Picture' }],
        loading: false,
        error: false,
        recordId: null,
        connectionStatus: null
    });
});

test('should delete attachment', () => {
    const previousState = {
        ...initialState,
        attachmentsList: [{ Id: '123', Title: 'Picture' }, { Id: '987', Title: 'File' }]
    };
    expect(reducer(previousState, deleteAttachment('987'))).toEqual({
        attachmentsList: [{ Id: '123', Title: 'Picture' }],
        localAttachmentsList: [],
        loading: false,
        error: false,
        recordId: null,
        connectionStatus: null
    });
});