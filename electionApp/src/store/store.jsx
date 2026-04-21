import {configureStore} from '@reduxjs/toolkit';
import { electionAppApi } from '../apis/electionAppApi';

const store = configureStore({
    reducer: {
        [electionAppApi.reducerPath]: electionAppApi.reducer
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(electionAppApi.middleware)  
})

export default store;