import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import attachmentsListReducers from './AttachmentsListReducers';
import searchAttachmentsReducers from './SearchAttachmentsReducers';


const reducer = combineReducers({
    attachmentsListReducers,
    searchAttachmentsReducers
});

const store = configureStore({ reducer });

export default store;
