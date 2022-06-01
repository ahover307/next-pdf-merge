import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    pdfSelection: []
}

export const pdfSelectSlice = createSlice({
    name: 'pdfSelect',
    initialState,
    reducers: {
        updatePDFSelection: (state, action) => {
            let listPDFs = state.pdfSelection;

            //The checkbox was either checked or unchecked,
            // Add or remove from list appropriately
            if (!listPDFs.includes(action.payload)) {
                listPDFs.push(action.payload);
            } else {
                //Look for the removed element, and assuming nothing is broke, remove it from the list
                const index = listPDFs.indexOf(action.payload);
                if (index > -1) {
                    listPDFs.splice(index, 1)
                }
            }

            state.pdfSelection = listPDFs;
        },
    }
});

export const {updatePDFSelection} = pdfSelectSlice.actions;

export default pdfSelectSlice.reducer