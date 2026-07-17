import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './applicationSlice/applicationSlice';

const reducer = combineReducers({
  application: applicationReducer,
});

const store = configureStore({ reducer });

export default store;
