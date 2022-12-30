import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import ordersListReducers from './orders';
import notificationReducer from './notification';

const reducer = combineReducers({
    ordersListReducers,
    notification: notificationReducer,
});

const store = configureStore({ reducer });

export default store;
