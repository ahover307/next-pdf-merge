import {
    Alert,
    Box,
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    Typography
} from "@mui/material";
import {Star, StarOutline} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {updatePDFSelection} from "../redux/pdfSelectSlice";
import {pdfInitialList} from "../lib/Constants";
import CloseIcon from "@mui/icons-material/Close";
import {toggleErrorPDFS} from "../redux/controlsSlice";

import styles from './PDFSelect.module.css';

export function PDFSelect() {
    //PDF Selector
    const colors = ['darkred', 'darkgreen', 'turquoise', 'gold', 'darkblue', 'blue']

    const pdfSelection = useSelector(state => state.pdfSelect.pdfSelection);
    const pdfError = useSelector(state => state.controls.errors.pdfs);
    const dispatch = useDispatch();

    const toggleError = () => {
        dispatch(toggleErrorPDFS());
    };

    const checked = (e) => {
        if (pdfError && pdfSelection.length === 0) {
            dispatch(toggleErrorPDFS());
        }

        dispatch(updatePDFSelection(e.target.name))
    };

    return <>
        <Box>
            <Typography>
                I want to learn more about:
            </Typography>
            <Typography>
                (Select skills below that you would like included in your toolkit)
            </Typography>
            <FormControl>

                <FormGroup
                    className={styles.checkbox_group}
                >
                    {pdfInitialList.map((e, index) =>
                        <FormControlLabel key={e.fileName}
                                          control={<Checkbox name={e.fileName}
                                                             checked={pdfSelection.includes(e.fileName)}
                                                             onChange={checked}
                                                             checkedIcon={<Star/>}
                                                             icon={<StarOutline/>}
                                                             sx={{
                                                                 color: colors[index % colors.length],
                                                                 '&.Mui-checked': {
                                                                     color: colors[index % colors.length]
                                                                 }
                                                             }}
                                          />}
                                          sx={{
                                              color: colors[index % colors.length],
                                          }}
                                          label={e.displayName}/>)}
                </FormGroup>
            </FormControl>
            <Collapse in={pdfError}>
                <Alert severity={"warning"}
                       action={
                           <IconButton aria-label={"close"}
                                       color={"inherit"}
                                       size={"small"}
                                       onClick={toggleError}>
                               <CloseIcon fontSize={"inherit"}/>
                           </IconButton>
                       }>
                    Warning - You must select at least one skill!
                </Alert>
            </Collapse>
        </Box>
    </>
}