import { LOADING_STATUS, NAMESPACE } from '../../constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as callToDoApi from '../../api/callToDoApi';
import { mapCall, mapCallToDos } from './utils/mappers';
import { fetchCallToDoRecordType } from '../../api/callToDoApi';

const DEFAULT_LIMIT = 5;

export const initialState = {
  list: {
    loadingStatus: LOADING_STATUS.IDLE,
    items: [],
    totalCount: 0,
    params: {
      callId: null,
      page: 1,
      rowsPerPage: DEFAULT_LIMIT,
      sortColumn: null,
      sortOrder: null,
    },
  },
  formLoadingStatus: LOADING_STATUS.IDLE,
  call: {},
  complianceTypes: [],
};

export const bootstrap = createAsyncThunk('callToDos/bootstrap', async (callId, { rejectWithValue }) => {
  try {
    const [{ records: callRecords }, complianceTypes] = await Promise.all([
      callToDoApi.fetchCall(callId),
      callToDoApi.fetchComplianceTypes(),
    ]);
    const call = callRecords[0];

    return {
      call: mapCall(call),
      complianceTypes,
    };
  } catch (error) {
    console.log(error);
    return rejectWithValue(error);
  }
});

export const fetchCallToDos = createAsyncThunk(
  'callToDos/fetchCallToDos',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const [{ records }, totalSize] = await Promise.all([
        callToDoApi.fetchCallToDos(params),
        callToDoApi.fetchCallToDosCount(params.callId),
      ]);

      dispatch(setTotalCount(totalSize));
      dispatch(setParams(params));

      return mapCallToDos(records);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const saveToDo = createAsyncThunk(
  'callToDos/saveToDo',
  async (params, { rejectWithValue, getState, dispatch }) => {
    try {
      const { callId, complianceType, compliance, surveyType, interviewee, otherInterviewee, id } = params;
      const fetchListParams = getState().callToDos.list.params;
      const recordType = await fetchCallToDoRecordType(complianceType);

      const toDoObj = {
        [`${NAMESPACE}Call__c`]: callId,
        [`${NAMESPACE}Compliance__c`]: compliance,
        [`${NAMESPACE}SurveyType__c`]: surveyType,
        RecordTypeId: recordType.Id,
        [`${NAMESPACE}Interviewee__c`]: interviewee,
        [`${NAMESPACE}IntervieweeOther__c`]: otherInterviewee,
      };

      const isEdit = Boolean(id);
      if (isEdit) {
        toDoObj.id = id;
      } else {
        toDoObj.sObject = `${NAMESPACE}CallToDo__c`;
      }

      await callToDoApi.saveCallToDo(toDoObj);
      dispatch(fetchCallToDos(fetchListParams));

      return { isEdit };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteToDo = createAsyncThunk(
  'callToDos/deleteToDo',
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const fetchListParams = getState().callToDos.list.params;

      await callToDoApi.deleteCallToDo(id);
      dispatch(fetchCallToDos(fetchListParams));
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

const slice = createSlice({
  name: 'callToDos',
  initialState,
  reducers: {
    setTotalCount: (state, action) => {
      state.list.totalCount = action.payload;
    },
    setParams: (state, action) => {
      state.list.params = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCallToDos.pending, (state) => {
      state.list.loadingStatus = LOADING_STATUS.PENDING;
    });

    builder.addCase(fetchCallToDos.fulfilled, (state, action) => {
      state.list.loadingStatus = LOADING_STATUS.SUCCESS;
      state.list.items = action.payload;
    });

    builder.addCase(fetchCallToDos.rejected, (state) => {
      state.list.loadingStatus = LOADING_STATUS.FAILED;
    });

    builder.addCase(bootstrap.fulfilled, (state, action) => {
      state.call = action.payload.call;
      state.complianceTypes = action.payload.complianceTypes;
    });

    builder.addCase(bootstrap.rejected, (state) => {
      state.list.loadingStatus = LOADING_STATUS.FAILED;
    });

    builder.addCase(saveToDo.pending, (state) => {
      state.formLoadingStatus = LOADING_STATUS.SUBMITTING;
    });

    builder.addCase(saveToDo.fulfilled, (state) => {
      state.formLoadingStatus = LOADING_STATUS.SUCCESS;
    });

    builder.addCase(saveToDo.rejected, (state) => {
      state.formLoadingStatus = LOADING_STATUS.FAILED;
    });

    builder.addDefaultCase(() => {});
  },
});

export const callToDosReducer = slice.reducer;

export const { setTotalCount, setParams } = slice.actions;
