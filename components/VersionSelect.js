import {
    Alert,
    Collapse,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {Star, StarOutline} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {setVersion} from "../redux/versionSlice";
import {toggleErrorType} from "../redux/controlsSlice";

export function VersionSelect() {
    //Teacher VS Family Control
    const colors = ['darkgreen', 'darkred']

    const version = useSelector(state => state.version.version);
    const typeError = useSelector(state => state.controls.errors.type);
    const dispatch = useDispatch();

    const versionChange = (e) => {
        console.log('version was changed');
        if (typeError) {
            dispatch(toggleErrorType());
        }

        dispatch(setVersion(e.target.value));
    }

    const toggleError = () => {
        dispatch(toggleErrorType());
    }

    return (
        <>
            <Grid container
                  spacing={2}
                  direction={'row'}
                  justifyContent={'center'}
                  alignItems={'center'}
            >
                <Grid item>
                    <Typography id={'toolkit-radio-group-label'}>
                        I am a (select one):
                    </Typography>
                </Grid>
                <Grid item>
                    <FormControl>
                        <RadioGroup aria-labelledby={'toolkit-radio-group-label'}
                                    name={'toolkit-radio-group'}
                                    value={version}
                                    onChange={versionChange}
                        >
                            <FormControlLabel sx={{color: colors[0]}}
                                              label={'Parent/Caregiver'}
                                              value={'family'}
                                              control={
                                                  <Radio sx={{
                                                      color: colors[0],
                                                      '&.Mui-checked': {
                                                          color: colors[0]
                                                      }
                                                  }}
                                                         icon={<StarOutline/>}
                                                         checkedIcon={<Star/>}
                                                  />}
                            />
                            <FormControlLabel sx={{color: colors[1]}}
                                              label={'Teacher'}
                                              value={'teacher'}
                                              control={
                                                  <Radio sx={{
                                                      color: colors[1],
                                                      '&.Mui-checked': {
                                                          color: colors[1]
                                                      }
                                                  }}
                                                         icon={<StarOutline/>}
                                                         checkedIcon={<Star/>}
                                                  />}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <Collapse in={typeError}>
                <Alert severity={"warning"}
                       action={
                           <IconButton aria-label={"close"}
                                       color={"inherit"}
                                       size={"small"}
                                       onClick={toggleError}>
                               <CloseIcon fontSize={"inherit"}/>
                           </IconButton>
                       }>
                    Warning - You must select one
                </Alert>
            </Collapse>
        </>
    );
}