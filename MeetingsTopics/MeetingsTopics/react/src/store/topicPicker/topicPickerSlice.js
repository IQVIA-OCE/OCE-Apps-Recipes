import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as productApi from '../../api/productApi';
import * as topicsApi from '../../api/topicsApi';
import * as meetingApi from '../../api/meetingApi';
import { LOADING_STATUS, NAMESPACE } from '../../constants';
import { mapMeetingTopics, mapTopics } from './utils/topicMappers';
import { mapMeeting } from './utils/meetingMappers'
import { localized } from '../../../bridge/Localization/localization';
import {
  fetchContext,
  fetchContextConditions,
  fetchContextType,
  fetchWorkflowConfiguration,
  fetchWorkflowNodes,
} from '../../api/workflowPath';

export const TOPICS_LIMIT = 15;

export const initialState = {
  meeting: {},
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  topics: [],
  isEnable: false,
  topicProducts: [],
  meetingTopics: [],
  meetingTopicsMap: {},
  selectedTopicsMap: {},
  isSystemGeneratedFilterEnabled: true,
  params: {
    limit: TOPICS_LIMIT,
    offset: 0,
    searchQuery: '',
  },
  error: null,
};

export const bootstrap = createAsyncThunk(
  'topicPicker/bootstrap',
  async ({ parentId }, { rejectWithValue }) => {
    try {
      const [[[meeting]], [meetingTopics]] = await Promise.all([
        meetingApi.fetchMeeting(parentId),
        topicsApi.fetchMeetingTopics(parentId),
      ]);

      return meeting && Object.keys(meeting).length
        ? {
            meeting: mapMeeting(meeting),
            meetingTopics: mapMeetingTopics(meetingTopics),
          }
        : rejectWithValue({
            message: localized(
              `${NAMESPACE}meeting_id_is_not_valid`,
              'Meeting ID is not valid'
            ),
          });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTopics = createAsyncThunk(
  'topicPicker/fetchTopics',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));

      const {
        topicPicker: { params, meeting, isSystemGeneratedFilterEnabled },
      } = getState();

      if (!(meeting && Object.keys(meeting).length)) return [];

      const [records] = await topicsApi.fetchTopics({
        ...params,
        meeting,
        isSystemGeneratedFilterEnabled,
      });

      return mapTopics(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMoreTopics = createAsyncThunk(
  'topicPicker/fetchMoreTopics',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const {
        topicPicker: { params, meeting, isSystemGeneratedFilterEnabled },
      } = getState();

      const [records] = await topicsApi.fetchTopics({
        ...params,
        meeting,
        isSystemGeneratedFilterEnabled,
        offset: params.offset + TOPICS_LIMIT,
      });

      dispatch(setOffset(params.offset + TOPICS_LIMIT));

      return mapTopics(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const camelize = str => str.slice(0, 1).toLowerCase() + str.slice(1);

const getPermissions = async obj => {
  let permissions = {
    canAdd: true,
    canEdit: true,
    canDelete: true,
  };

  try {
    const [[contextType]] = await fetchContextType(
      `${NAMESPACE}MeetingTopic__c`
    );

    const [[workflowConfig]] = await fetchWorkflowConfiguration(
      contextType['Id']
    );
    if (workflowConfig && workflowConfig['Id']) {
      let conditionsPassed;

      const conditionCheckers = {
        EQUALS: (value, conditionValue) => value === conditionValue,
        NOT_EQUALS: (value, conditionValue) => value !== conditionValue,
        EQUALS_NULL: value => value === null,
        NOT_EQUALS_NULL: value => value !== null,
        IN: (value, conditionValue) =>
          conditionValue.split(';').includes(value),
        NOT_IN: (value, conditionValue) =>
          !conditionValue.split(';').includes(value),
      };

      const [workflowNodes] = await fetchWorkflowNodes(workflowConfig['Id']);

      const relatedWorkflowNode = workflowNodes.find(el => {
        const controllingField = camelize(
          workflowConfig[`${NAMESPACE}ControllingField__c`]
        );

        return el[`${NAMESPACE}MeetingStatus__c`] === obj[controllingField];
      });

      const [[workflowContext]] = await fetchContext(relatedWorkflowNode['Id']);

      const [workflowConditions] = await fetchContextConditions(
        workflowContext['Id']
      );

      for (let i = 0; i < workflowConditions.length; i++) {
        if (conditionsPassed === false) break;

        const condition = workflowConditions[i];

        const fieldName = condition[`${NAMESPACE}Field__c`];
        const operator = condition[`${NAMESPACE}Operator__c`];
        const value = condition[`${NAMESPACE}Value__c`];

        conditionsPassed = conditionCheckers[operator](
          obj[camelize(fieldName)],
          value
        );
      }

      permissions = conditionsPassed
        ? {
            canAdd: workflowContext[`${NAMESPACE}Create__c`],
            canEdit: workflowContext[`${NAMESPACE}Edit__c`],
            canDelete: workflowContext[`${NAMESPACE}Delete__c`],
          }
        : {
            canAdd: false,
            canEdit: false,
            canDelete: false,
          };

      return permissions;
    }
  } catch (error) {
    throw error;
  }
};

export const saveSelectedTopics = createAsyncThunk(
  'topicPicker/saveSelectedTopics',
  async (_, { getState, rejectWithValue }) => {
    const {
      topicPicker: {
        meeting,
        meetingTopics,
        meetingTopicsMap,
        selectedTopicsMap,
        topics,
      },
    } = getState();
    try {
      const topicsToAdd = topics.filter(
        t => selectedTopicsMap[t.id] && !meetingTopicsMap[t.id]
      );

      if (topicsToAdd.length) {
        const mappedTopicToAdd = topicsToAdd.map(topic => {
          return {
            [`${NAMESPACE}Meeting__c`]: meeting.id,
            [`${NAMESPACE}Topic__c`]: topic.id,
          };
        });

        await topicsApi.createMeetingTopics(mappedTopicToAdd);

        const keys = topicsToAdd.map(t => t.id);

        keys.map(async topicId => {
          const [products] = await productApi.fetchTopicsProducts(topicId);

          if (products.length) {
            const mappedMeetingProductToAdd = products.map(product => {
              return {
                [`${NAMESPACE}Meeting__c`]: meeting.id,
                [`${NAMESPACE}Topic__c`]: product[`${NAMESPACE}Topic__c`],
                [`${NAMESPACE}Product__c`]: product[`${NAMESPACE}Product__c`],
              };
            });

            if (mappedMeetingProductToAdd.length) {
              await productApi.createMeetingProducts(mappedMeetingProductToAdd);
            }
          }
        });
      }

      const topicsToDelete = meetingTopics.filter(t =>
        Boolean(!selectedTopicsMap[t.topic] && meetingTopicsMap[t.topic])
      );

      if (topicsToDelete.length) {
        try {
          for (const topic of topics) {
            const permissions = await getPermissions(topic);

            if (!permissions.canDelete) {
              return rejectWithValue({
                message: 'Workflow validation error',
              });
            }
          }
        } catch (e) {
          return rejectWithValue(e);
        }
      }

      const topicsToDeleteIds = topicsToDelete.map(m => m.id);

      if (topicsToDelete.length) {
        await topicsApi.deleteMeetingTopic(topicsToDeleteIds);
      }

      if (topicsToDelete) {
        topicsToDelete.map(async el => {
          const [products] = await productApi.fetchMeetingProduct(
            meeting.id,
            el.topic
          );
          const productsToDeleteIds = products.map(product => product.Id);

          await productApi.deleteMeetingProducts(productsToDeleteIds);
        });
      }

      return {
        wasSomeDataSaved: Boolean(topicsToAdd.length || topicsToDelete.length),
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = _initialState =>
  createSlice({
    name: 'topicPicker',
    initialState: _initialState,
    reducers: {
      setOffset: (state, action) => {
        state.params.offset = action.payload;
      },
      setTopicSearchQuery: (state, action) => {
        state.params.searchQuery = action.payload;
      },
      toggleSelectTopic: (state, action) => {
        const { topic, topicId } = action.payload;

        const nextValue = !state.selectedTopicsMap[topicId] ? topic : null;
        state.selectedTopicsMap[topicId] = nextValue;
      },
      toggleSystemGeneratedFilter: state => {
        state.isSystemGeneratedFilterEnabled = !state.isSystemGeneratedFilterEnabled;
      },
      setMeeting: (state, action) => {
        state.meeting = action.payload;
      },
      setRecordType: (state, action) => {
        state.recordType = action.payload;
      },
    },

    extraReducers: {
      [fetchTopics.pending]: state => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchTopics.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.topics = action.payload;

        action.payload.forEach(topic => {
          if (state.meetingTopicsMap[topic.id]) {
            state.selectedTopicsMap[topic.id] = topic;
          }
        });
      },
      [fetchTopics.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },

      [fetchMoreTopics.pending]: state => {
        state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
        state.error = null;
      },
      [fetchMoreTopics.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.topics = [...state.topics, ...action.payload];

        action.payload.forEach(topic => {
          if (state.meetingTopicsMap[topic.id]) {
            state.selectedTopicsMap[topic.id] = topic;
          }
        });
      },
      [fetchMoreTopics.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },

      [bootstrap.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.IDLE;
        state.meeting = action.payload.meeting;
        state.meetingTopics = action.payload.meetingTopics;

        state.meetingTopicsMap = action.payload.meetingTopics.reduce(
          (acc, cur) => {
            acc[cur.topic] = cur;
            return acc;
          },
          {}
        );
      },
      [bootstrap.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },

      [saveSelectedTopics.pending]: state => {
        state.loadingStatus = LOADING_STATUS.PENDING;
      },
      [saveSelectedTopics.fulfilled]: state => {
        state.loadingStatus = LOADING_STATUS.SAVED;
      },
      [saveSelectedTopics.rejected]: state => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
      },
    },
  });

export const topicPickerSlice = makeSlice(initialState);

export const {
  setOffset,
  setTopicSearchQuery,
  toggleSelectTopic,
  setMeeting,
  setRecordType,
  toggleSystemGeneratedFilter,
} = topicPickerSlice.actions;

export const topicPickerReducer = topicPickerSlice.reducer;
