import {createTheme} from "@mui/material";

export const pdfInitialList = [
    {type: 'w', fileName: 'responsibility', displayName: 'Accepts Responsibility for Choices and Actions'},
    {type: 'm', fileName: 'independence', displayName: 'Can Work Independently'},
    {type: 'm', fileName: 'completes-work', displayName: 'Completes Work on Time'},
    {type: 'm', fileName: 'effort', displayName: 'Demonstrates Consistent Effort'},
    {type: 'w', fileName: 'conflict', displayName: 'Handles Conflict Appropriately'},
    {type: 'w', fileName: 'listens', displayName: 'Listens and Follows Directions'},
    {type: 'w', fileName: 'movements', displayName: 'Makes Appropriate Movements between Activities'},
    {type: 'm', fileName: 'organize', displayName: 'Organizes Self, Materials, and Belongings'},
    {type: 'm', fileName: 'participates', displayName: 'Participates in Group Activities'},
    {
        type: 'w',
        fileName: 'respect-rights',
        displayName: 'Respects Rights, Diversity, Feelings, and Property of Others'
    },
    {type: 'w', fileName: 'respect-school', displayName: 'Respects School Environment and Materials'},
    {type: 'm', fileName: 'positive', displayName: 'Shows Positive Attitude toward Learning'},
    {type: 'm', fileName: 'quality', displayName: 'Strives for Quality Work'},
    {type: 'w', fileName: 'cooperation', displayName: 'Works and Plays Cooperatively with Others'},
]

export const theme = createTheme({
    palette: {
        // primary: {},
        // secondary: {}
    }
})

export const schools = ['DTSD', 'Lower Dauphin', 'CD East']