import {configureStore} from '@reduxjs/toolkit';
import personalReducer from './personalSlice';
import versionReducer from './versionSlice';
import pdfSelectReducer from './pdfSelectSlice';
import controlsReducer from './controlsSlice';

// https://redux-toolkit.js.org/tutorials/quick-start
export const store = configureStore({
    reducer: {
        personal: personalReducer,
        version: versionReducer,
        pdfSelect: pdfSelectReducer,
        controls: controlsReducer,
    },
});
