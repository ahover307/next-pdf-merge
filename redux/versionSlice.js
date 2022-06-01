import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    version: '',
}

export const versionSlice = createSlice({
    name: 'version',
    initialState,
    reducers: {
        setVersion: (state, action) => {
            state.version = action.payload;
        },
    }
});

export const {setVersion} = versionSlice.actions;

export default versionSlice.reducer