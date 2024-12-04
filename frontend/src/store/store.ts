import {configureStore} from '@reduxjs/toolkit';

import invoiceReducer from '../features/invoiceSlice';


const store= configureStore({
    reducer:{
        invoices: invoiceReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
