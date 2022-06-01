import {
    Autocomplete,
    Box,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import {Star, StarOutline} from "@mui/icons-material";
import {schools} from "../lib/Constants";
import {useDispatch, useSelector} from "react-redux";
import {setEmail, setName, setSchool, setSchoolValue} from "../redux/personalSlice";

import styles from './PersonalInfo.module.css';

export function PersonalInfo() {
    //Data Form
    const colors = ['darkgreen', 'darkred', 'darkorange', "darkblue"]

    const personalInfo = useSelector(state => state.personal);
    const version = useSelector(state => state.version.version);
    const dispatch = useDispatch();

    const textChange = (e) => {
        dispatch(setName(e.target.value))
    }

    const emailChange = (e) => {
        dispatch(setEmail(e.target.value));
    }

    const radioChange = (e) => {
        dispatch(setSchoolValue(e.target.value));
    }

    const schoolDropdown = (e, newValue) => {
        dispatch(setSchool(newValue));
    }
    const schoolText = (e) => {
        dispatch(setSchool(e.target.value));
    }

    return <>
        <Box>
            <Grid container
                  spacing={2}
                  direction={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
            >
                <Grid item>
                    <Typography>
                        {/*TODO Test Version flag*/}
                        {version === 'family' ? 'Child\'s ' : ''}Name (Optional):
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField id={'name'}
                               name={'name'}
                               label={'Name'}
                               value={personalInfo.name}
                               onChange={textChange}
                               className={styles.text_input}/>
                </Grid>
                <Grid item>
                    <Typography>
                        {version === 'family' ? 'Child\'s ' : ''}School (Optional):
                    </Typography>
                    <Grid container
                          spacing={1}
                          direction={'row'}
                          justifyContent={'center'}
                          alignItems={'center'}>
                        <Grid item sm={4}>
                            {version === 'teacher' ? 'I am a teacher at:'
                                : version === 'family' ? 'My child attends'
                                    : 'Home School:'}
                        </Grid>
                        <Grid item sm={8}>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby={'toolkit-radio-group-label'}
                                    name={'toolkit-radio-group'}
                                    value={personalInfo.schoolValue}
                                    onChange={radioChange}
                                    className={styles.radio_select}
                                >
                                    <FormControlLabel sx={{color: colors[0]}}
                                                      value={'public'}
                                                      control={
                                                          <Radio
                                                              sx={{
                                                                  color: colors[0],
                                                                  '&.Mui-checked': {
                                                                      color: colors[0]
                                                                  }
                                                              }}
                                                              icon={<StarOutline/>}
                                                              checkedIcon={<Star/>}
                                                          />}
                                                      label={'A public school in Philadelphia'}
                                    />
                                    <FormControlLabel sx={{color: colors[1]}}
                                                      value={'private'}
                                                      control={
                                                          <Radio
                                                              sx={{
                                                                  color: colors[1],
                                                                  '&.Mui-checked': {
                                                                      color: colors[1]
                                                                  }
                                                              }}
                                                              icon={<StarOutline/>}
                                                              checkedIcon={<Star/>}
                                                          />}
                                                      label={'A private or parochial school in Philadelphia'}
                                    />
                                    <FormControlLabel sx={{color: colors[2]}}
                                                      value={'outside philly'}
                                                      control={
                                                          <Radio
                                                              sx={{
                                                                  color: colors[2],
                                                                  '&.Mui-checked': {
                                                                      color: colors[2]
                                                                  }
                                                              }}
                                                              icon={<StarOutline/>}
                                                              checkedIcon={<Star/>}
                                                          />}
                                                      label={'A school outside of Philadelphia'}
                                    />
                                    <FormControlLabel sx={{color: colors[3]}}
                                                      value={'no answer'}
                                                      control={
                                                          <Radio
                                                              sx={{
                                                                  color: colors[3],
                                                                  '&.Mui-checked': {
                                                                      color: colors[3]
                                                                  }
                                                              }}
                                                              icon={<StarOutline/>}
                                                              checkedIcon={<Star/>}
                                                          />}
                                                      label={'Decline to answer'}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    {personalInfo.schoolValue === 'public' ?
                        <Autocomplete
                            id={'school'}
                            onChange={schoolDropdown}
                            value={personalInfo.school}
                            className={styles.auto_complete}
                            renderInput={(params) =>
                                <TextField {...params}
                                           label={'School'}
                                           required={personalInfo.schoolValue === 'public'}
                                />}
                            options={schools}
                            freeSolo
                        />
                        : personalInfo.schoolValue === 'private' || personalInfo.schoolValue === 'outside philly' ?
                            <TextField
                                id={'school'}
                                label={'School'}
                                required={personalInfo.schoolValue === 'private' || personalInfo.schoolValue === 'outside philly'}
                                onChange={schoolText}
                                value={personalInfo.school}
                                className={styles.auto_complete}
                            />
                            : <></>}
                </Grid>
                {/*<br/>*/}
                <Grid item>
                    <Typography>
                        I would like to learn more about Conquering Kindergarten!
                        (Enter your email to receive messages from us in the future)
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField id={'email'}
                               name={'email'}
                               type={'email'}
                               label={'Email'}
                               value={personalInfo.email}
                               onChange={emailChange}
                               className={styles.text_input}/>
                </Grid>
            </Grid>
        </Box>
    </>;
}