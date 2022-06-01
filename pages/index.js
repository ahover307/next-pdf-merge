import {Box, Button, Step, StepContent, StepLabel, Stepper, Typography} from "@mui/material";
import {PersonalInfo} from "../components/PersonalInfo";
import {PDFSelect} from "../components/PDFSelect";
import {RequestPDF} from "../components/RequestPDF";
import {Complete} from "../components/Complete";
import {VersionSelect} from "../components/VersionSelect";
import {ThemeProvider} from "@mui/material/styles";

import {theme} from "../lib/Constants";
import {useDispatch, useSelector} from "react-redux";
import {
    decrementActiveStep,
    incrementActiveStep,
    setLink,
    toggleErrorPDFS,
    toggleErrorType
} from "../redux/controlsSlice";

export default function Index() {
    const vertical = true

    //Check these states for errors before letting continue
    // const personalInfo = useSelector(state => state.personal);
    const controls = useSelector(state => state.controls);
    const pdfSelection = useSelector(state => state.pdfSelect.pdfSelection);
    const version = useSelector(state => state.version.version);

    const dispatch = useDispatch();

    //Enable these lines when the emulator is running to test functions
    // const functions = getFunctions(getApp());
    // connectFunctionsEmulator(functions, "localhost", 5001);

    function completedLink(link) {
        handleNext();
        dispatch(setLink(link));
    }

    function handleNext() {
        //Depending on the page, we need to do different input validation
        switch (controls.activeStep) {
            case 0:
                console.log('Selector');
                if (version === '') {
                    if (!controls.errors.type) {
                        dispatch(toggleErrorType());
                    }
                    console.log('Please make a selection');
                    return;
                }
                break;
            case 1:
                console.log('Data Entry');
                //If we wanted, we could add a warning here if any boxes are blank
                //Something like, hey are you sure you want to skip
                //TODO Warning on empty
                break;
            case 2:
                console.log('PDF Selector');
                if (pdfSelection.length === 0) {
                    if (!controls.errors.pdfs) {
                        dispatch(toggleErrorPDFS());
                    }
                    console.log('No PDFS were selected');
                    return;
                }
                break;
            case 3:
                console.log('Submission');
                break;
            case 4:
                console.log('Confirmation')
                break;
            default:
                console.log('Default Case. Should never be hit')
        }

        dispatch(incrementActiveStep());
    }

    function handleBack() {
        dispatch(decrementActiveStep());
    }

    function handleReset() {
        //TODO Reset all slices
        // this.setState(this.initialState);
    }

    const webControls = [
        {
            label: "Select Toolkit ",
            content: <VersionSelect key={'familyVTeacherRadio'}/>,
        },
        {
            label: "Enter Your Information",
            content: <PersonalInfo key={'dataEntry'}/>,
        },
        {
            label: "Choose Skills",
            content: <PDFSelect key={'pdfSelector'}/>,
        },
        {
            label: "Submit",
            content: <RequestPDF key={'submitRequest'} completed={completedLink}/>,
        },
        {
            label: "Finish",
            content: <Complete key={'final'} link={controls.link}/>
        }
    ];

    return (
        <div style={{maxWidth: 500, alignContent: 'center', margin: 'auto'}}>
            <ThemeProvider theme={theme}>
                <Typography variant={'h4'}>
                    Create your custom toolkit!
                </Typography>
                {vertical ? (
                        controls.errors.general ?
                            <>
                                {/*TODO Better error message here*/}
                                Something appears to have gone wrong while creating your custom toolkit.
                                Please refresh the page and try again, or
                                if this keeps appearing email us at *email* to let us know there is an issue
                            </>
                            : <>
                                {/*Vertical Stepper*/}
                                <Stepper orientation={"vertical"} activeStep={controls.activeStep}>
                                    {/*All the steps in the top bar*/}
                                    {webControls.map((e, index) => (
                                        <Step key={e.label}>
                                            <StepLabel>{e.label}</StepLabel>
                                            <StepContent>
                                                {e.content}
                                                <Box sx={{mt: 2, mb: 1}}>
                                                    {index === webControls.length - 1 ?
                                                        <>
                                                            <Button onClick={handleReset}>
                                                                Reset
                                                            </Button>
                                                        </>
                                                        :
                                                        <>
                                                            {/*Disabled if on first step or while waiting*/}
                                                            <Button color={'secondary'}
                                                                    disabled={index === 0 || controls.waiting}
                                                                    onClick={handleBack}>
                                                                Back
                                                            </Button>
                                                            {/*Disabled while waiting*/}
                                                            <Button color={'primary'}
                                                                    disabled={index === 3 || controls.waiting}
                                                                    onClick={handleNext}>
                                                                Next
                                                            </Button>
                                                        </>
                                                    }
                                                </Box>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                            </>
                    )
                    : (
                        controls.errors.general ?
                            <>
                                {/*    TODO Better error message here*/}
                                Something appears to have gone wrong while creating your custom toolkit.
                                Please refresh the page and try again, or
                                if this keeps appearing email us at *email* to let us know there is an issue
                            </>
                            : <>
                                {/*Horizontal Stepper*/}
                                <Stepper activeStep={controls.activeStep}>
                                    {/*All the steps in the top bar*/}
                                    <Step key={'stepFamilyVTeacher'}>
                                        <StepLabel>Select Toolkit Type</StepLabel>
                                    </Step>
                                    <Step key={'stepDataEntry'}>
                                        <StepLabel>Enter Your Information</StepLabel>
                                    </Step>
                                    <Step key={'stepPDFSelector'}>
                                        <StepLabel>Choose Skills</StepLabel>
                                    </Step>
                                    <Step key={'stepSubmission'}>
                                        <StepLabel>Submit</StepLabel>
                                    </Step>
                                </Stepper>
                                {webControls[controls.activeStep]['content']}
                                <Box sx={{mt: 2, mb: 1}}>
                                    {controls.activeStep === webControls.length - 1 ?
                                        <>
                                            <Button onClick={handleReset}>
                                                Reset
                                            </Button>
                                        </>
                                        :
                                        <>
                                            {/*Disabled if on first step or while waiting*/}
                                            <Button color={'secondary'}
                                                    disabled={controls.activeStep === 0 || controls.waiting}
                                                    onClick={handleBack}>
                                                Back
                                            </Button>
                                            {/*Disabled while waiting*/}
                                            <Button color={'primary'}
                                                    disabled={controls.activeStep === 3 || controls.waiting}
                                                    onClick={handleNext}>
                                                Next
                                            </Button>
                                        </>
                                    }
                                </Box>
                            </>
                    )
                }
            </ThemeProvider>
        </div>
    );
}