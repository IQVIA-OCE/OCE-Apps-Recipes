import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { ordersListReducer } from './orders';
import { notificationReducer } from './notification';

const reducer = combineReducers({
    orders: ordersListReducer,
    notification: notificationReducer,
});

const store = configureStore({ reducer });

export default store;
