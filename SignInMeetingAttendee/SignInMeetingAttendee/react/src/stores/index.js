import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { meeting } from './meeting';

const reducer = combineReducers({ meeting });

const store = configureStore({ reducer });

export default store;
