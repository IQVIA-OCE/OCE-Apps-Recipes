export const topicsSelector = state =>
  state.topicPicker.topics;

export const loadingTopicStatusSelector = state =>
  state.topicPicker.loadingStatus;

export const searchTopicQuerySelector = state =>
  state.topicPicker.params.searchQuery;

export const isSelectedSelector = id => state =>
  Boolean(state.topicPicker.selectedTopicsMap[id]);

export const systemGeneratedFilterSelector = state =>
  state.topicPicker.isSystemGeneratedFilterEnabled;

export const meetingSelector = state =>
  state.topicPicker.meeting;

