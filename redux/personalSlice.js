import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    schoolValue: 'none',
    school: null,
}

export const personalSlice = createSlice({
    name: 'personal',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setSchoolValue: (state, action) => {
            state.schoolValue = action.payload;
        },
        setSchool: (state, action) => {
            state.school = action.payload;
        }
    }
});

export const {setName, setEmail, setSchoolValue, setSchool} = personalSlice.actions;

export default personalSlice.reducer