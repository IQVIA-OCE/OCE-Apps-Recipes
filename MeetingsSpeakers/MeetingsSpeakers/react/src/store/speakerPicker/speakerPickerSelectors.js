export const speakersSelector = state => state.speakerPicker.speakers;

export const loadingStatusSelector = state => state.speakerPicker.loadingStatus;

export const searchQuerySelector = state => state.speakerPicker.params.searchQuery;

export const isInvitedSelector = id => state => Boolean(state.speakerPicker.invitedSpeakersMap[id]);

export const isSystemGeneratedFilterEnabledSelector = state => state.speakerPicker.isSystemGeneratedFilterEnabled;

export const userPreferredCountriesSelector = state => state.speakerPicker.params.userPreferredCountries;
