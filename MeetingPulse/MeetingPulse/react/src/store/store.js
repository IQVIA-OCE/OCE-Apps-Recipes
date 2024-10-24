import { configureStore } from '@reduxjs/toolkit';
import meetingReducer from './meetingSlice/meetingSlice';
import attendeesReducer from './attendeesSlice/attendeesSlice';
import notificationReducer from './notificationSlice/notificationSlice';
import insightsReducer from './insightsSlice/insightsSlice';
import outstandingSampleRequestsReducer from './outstandingSampleRequestsSlice/outstandingSampleRequestsSlice';
import inquiriesReducer from './inquiriesSlice/inquiriesSlice';

export default configureStore({
  reducer: {
    meeting: meetingReducer,
    attendees: attendeesReducer,
    notification: notificationReducer,
    insights: insightsReducer,
    outstandingSampleRequests: outstandingSampleRequestsReducer,
    inquiries: inquiriesReducer,
  },
});
