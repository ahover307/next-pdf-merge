import {Button, CircularProgress, Typography} from "@mui/material";
import {pdfInitialList} from "../lib/Constants";
import {useDispatch, useSelector} from "react-redux";
import {toggleErrorFunction, toggleErrorGeneral, toggleWaiting} from "../redux/controlsSlice";

// Confirmation
const fetcher = (query) => {
    return fetch('/api/mergePDFs', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(query),
    })
        .then((res) => res.json())
}

export function RequestPDF(props) {
    const [personalInfo, pdfSelection, version] = useSelector(state => [state.personal, state.pdfSelect.pdfSelection, state.version.version]);
    const controls = useSelector(state => state.controls)
    const dispatch = useDispatch();

    function handleClick() {
        let schoolValue = 'None Selected'
        if (personalInfo.schoolValue === 'public') {
            schoolValue = 'Public Philly School';
        } else if (personalInfo.schoolValue === 'private') {
            schoolValue = 'Private Philly School';
        } else if (personalInfo.schoolValue === 'outside philly') {
            schoolValue = 'School outside Philly';
        }

        const d = new Date();
        const dataObject = {
            'allPDFS': pdfInitialList,
            'listOfFiles': pdfSelection,
            'type': version,
            'fileName': (personalInfo.name ? personalInfo.name + '\'s ' : '') + 'Custom Toolkit - ' + d.getTime() + '.pdf',
            'requested_date': d,
            'name': personalInfo.name,
            'email': personalInfo.email,
            'school': personalInfo.school,
            'schoolValue': schoolValue,
        }

        console.log(dataObject);

        //TODO Call API
        const response = fetcher(dataObject).then((result) => {
            console.log(result);
            console.log(result['data']['link']);
            return;

            if (result['data']['error']) {
                dispatch(toggleErrorGeneral(result['data']['msg']));
                dispatch(toggleWaiting());
                return
            }

            window.open(result['data']['link'], '_blank');

            dispatch(toggleWaiting());

            //TODO Test this

            props.completed(result['data']['link']);
            // dispatch(setLink(result['data']['link']));
        }).catch((e) => {
            if (e.status === 500) {
                alert('Invoke function threw an error. Check console for help');
                console.error(e);
                dispatch(toggleErrorFunction());
            }
        })

        // dispatch(toggleWaiting());
    }

    //Waiting should flip while the function is running, will be changed back when the function returns the file
    return !controls.waiting ? <>
        {/*This block if waiting is still false*/}
        <br/>
        <Typography variant={'h5'}>
            Click below to request your custom toolkit!
        </Typography>
        <br/>
        <br/>
        <Typography>
            This will submit the request to us, create the toolkit, and should return shortly.
        </Typography>
        <Typography>
            (Please note this link will expire in 24 hours,
            so download the file if you wish to keep viewing after that time)
        </Typography>
        <br/>
        <Button variant={'contained'} onClick={handleClick}>Get My Custom Toolkit</Button>
    </> : <>
        {/*This block if waiting is now true*/}
        <CircularProgress/>
        <Typography>
            Good things are on their way!
        </Typography>
        <Typography>
            Please do not close this window...
        </Typography>
    </>
}
