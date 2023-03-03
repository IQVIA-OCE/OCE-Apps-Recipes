import { configureStore } from '@reduxjs/toolkit'
import { sortListReducer } from './sortSlice/sortListSlice'
import { accountReducer } from './accountSlice/accountSlice';

export const store = configureStore({
    reducer: {
        sortList: sortListReducer,
        account: accountReducer
    },
})
