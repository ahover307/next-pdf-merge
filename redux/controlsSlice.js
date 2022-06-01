import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    link: null,
    activeStep: 0,
    waiting: false,
    errors: {
        type: false,
        general: false,
        pdfs: false,
        function: false,
        generalMsg: null,
    },
};

export const controlsSlice = createSlice({
    name: 'controls',
    initialState,
    reducers: {
        setLink: (state, action) => {
            state.link = action.payload
        },
        toggleWaiting: (state) => {
            state.waiting = !state.waiting;
        },
        toggleErrorType: (state) => {
            state.errors.type = !state.errors.type;
        },
        toggleErrorGeneral: (state, action) => {
            state.errors.general = !state.errors.general;
            state.errors.generalMsg = action.payload;
        },
        toggleErrorPDFS: (state) => {
            state.errors.pdfs = !state.errors.pdfs;
        },
        toggleErrorFunction: (state) => {
            state.errors.function = !state.errors.function;
        },
        incrementActiveStep: (state) => {
            state.activeStep = state.activeStep + 1;
        },
        decrementActiveStep: (state) => {
            state.activeStep = state.activeStep - 1;
        },
    }
});

export const {
    setLink,
    toggleWaiting,
    toggleErrorType,
    toggleErrorPDFS,
    toggleErrorGeneral,
    incrementActiveStep,
    decrementActiveStep,
    toggleErrorFunction
} = controlsSlice.actions;

export default controlsSlice.reducer