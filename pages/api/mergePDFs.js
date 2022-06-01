const path = require('path');
const os = require('os');
const fs = require('fs');

//https://stackoverflow.com/questions/44448029/how-to-use-google-sheets-api-while-inside-a-google-cloud-function
//Library to push into sheets to use as a database
const {google} = require('googleapis');

// https://pdf-lib.js.org/
//Library to read and edit the pdf docs
const PDFDocument = require('pdf-lib');

const pathToPDFS = 'lib/pdfs/';

export default async function handler(req, res) {
    //Extract body from the request.
    //Thats the only bit we care about
    const data = req.body;

    /*--------------------Error Check--------------------*/
    if (!data.listOfFiles || typeof data.listOfFiles !== typeof []) {
        console.warn('There was an issue with the param listOfFiles');
        return {error: false};
    }
    /*--------------------End Error Check--------------------*/

    /*--------------------Set up data--------------------*/
    //TODO Storage?
    let mergedPDF = await PDFDocument.PDFDocument.create();

    const finalFileName = data.fileName && typeof data.fileName === typeof 'String' ? data.fileName : 'Custom Toolkit.pdf';
    const metadata = {
        contentType: 'application/pdf',
    };

    let meSkills = []
    let weSkills = []
    for (let i = 0; i < data.allPDFS.length; i++) {
        if (data.listOfFiles.includes(data.allPDFS[i].fileName))
            if (data.allPDFS[i].type === 'w') {
                weSkills.push(data.allPDFS[i].displayName);
            } else {
                meSkills.push(data.allPDFS[i].displayName);
            }
    }

    const preFileNames = data.listOfFiles.map(e => data.type[0] + '-' + e + '.pdf')
    let listOfFilePaths = [];
    /*--------------------End Set up data--------------------*/

    /*--------------------Cover And Welcome Page--------------------*/
    //Download and edit the cover and welcome pages at first,
    // then add them to the beginning of the array
    // Download file from bucket.
    let coverFilePath = path.join(pathToPDFS, 'cover.pdf');
    let welcomeFilePath = path.join(pathToPDFS, 'welcome.pdf');

    console.log('Complete finding cover and welcome');

    //Edit Cover File to include name
    console.log('Edit Cover');
    const coverPDF = await PDFDocument.PDFDocument.load(fs.readFileSync(coverFilePath))
    const coverForm = coverPDF.getForm()
    coverForm.getTextField('Name').setText(data.name)
    coverForm.flatten();
    (await mergedPDF.copyPages(coverPDF, coverPDF.getPageIndices())).forEach((page) => {
        mergedPDF.addPage(page);
    });

    //Edit Welcome page (ME / WE skills)
    console.log('Edit Welcome');
    const welcomePDF = await PDFDocument.PDFDocument.load(fs.readFileSync(welcomeFilePath));
    const welcomeForm = welcomePDF.getForm();
    welcomeForm.getTextField('MeSkills').setText(meSkills.join('\n'));
    welcomeForm.getTextField('WeSkills').setText(weSkills.join('\n'));
    welcomeForm.flatten();
    (await mergedPDF.copyPages(welcomePDF, welcomePDF.getPageIndices())).forEach((page) => {
        mergedPDF.addPage(page);
    });
    /*--------------------End Cover And Welcome Page--------------------*/

    /*--------------------Download All Files--------------------*/
    //Run through each file that was chosen for it
    for (const fileName of preFileNames) {
        //Minor Validation
        if (!fileName.includes('.pdf')) {
            console.error('File chosen was not a pdf.');
            res.json({'error': true, msg: 'File requested must be a pdf'});
            return;
        }

        // Download file from bucket.
        const tempFilePath = path.join(pathToPDFS, fileName);

        listOfFilePaths.push(tempFilePath);

        console.log('PDF found locally under temp path: ', tempFilePath);
    }

    if (listOfFilePaths.length === 0) {
        console.log('No files were selected to combine');
        res.json({'error': false, link: ''});
        return;
    }
    /*--------------------End Download All Files--------------------*/

    /*--------------------Merge Files--------------------*/
    for (const path of listOfFilePaths) {
        console.log('Adding file: ', path);
        const currentDoc = await PDFDocument.PDFDocument.load(fs.readFileSync(path));

        (await mergedPDF.copyPages(currentDoc, currentDoc.getPageIndices())).forEach((page) => {
            mergedPDF.addPage(page);
        });
    }

// Create file path for upload to remote
    let tempFinalFilePath = path.join(pathToPDFS, 'combined-file.pdf');

// Convert and merge the files together.
    const finalFileBytes = await mergedPDF.save();
    fs.writeFileSync(tempFinalFilePath, finalFileBytes);
    console.log('Combined PDF created under temp file path: ', tempFinalFilePath);
    /*--------------------End Merge Files--------------------*/

    /*--------------------Upload Files--------------------*/
// Uploading the file.
// //    TODO Public file access
//     const uploadResponse = await publicBucket.upload(tempFinalFilePath, {
//         destination: finalFileName,
//         metadata: metadata,
//     });

    // TODO File access
    // const fileMetaData = (await uploadResponse[0].getMetadata())[0]
    // const downloadLink = encodeURI("https://storage.googleapis.com/" + fileMetaData['bucket'] + '/' + fileMetaData['name'])
    //Remove link to tmp directory
    //TODO Filesystem
    // fs.unlinkSync(tempFinalFilePath);
    /*--------------------End Upload Files--------------------*/

    /*--------------------Post to DB--------------------*/
    // //TODO Database
    // await admin.firestore().collection('users').add({
    //     'downloadLink': downloadLink,
    //     'type': data.type,
    //     'fileName': data.fileName,
    //     'requested_date': data.requested_date,
    //     'doc_published_date': new Date(),
    //     'name': data.name,
    //     'email': data.email,
    //     'school': data.school,
    //     'schoolType': data.schoolValue,
    //     'weSkills': weSkills,
    //     'meSkills': meSkills,
    // });
    /*--------------------End Post to DB--------------------*/

    /*--------------------Post to Sheets--------------------*/
    //Example
    //https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/sheets/append.js
    //https://stackoverflow.com/questions/44448029/how-to-use-google-sheets-api-while-inside-a-google-cloud-function

    //Get auth token
    let jwt = getJwt();
    //Get api token
    let apiKey = getApiKey();
    //Specify the id to our sheet
    let spreadsheetId = '1vqM3Ei9O2ygPlR5tODD1wKRQvWzmaQS1s9k3Pqzq-8k';
    //Will append to the bottom of the range, start looking at the given cell, and the library will find the last row from here down
    let range = 'DATABASE!A2';
    //Data to insert, and make a note of which skills are included
    let row = [data.requested_date, new Date(), data.name, data.schoolValue, data.school, data.email, data.type,
        data.listOfFiles.includes('responsibility'),
        data.listOfFiles.includes('conflict'),
        data.listOfFiles.includes('listens'),
        data.listOfFiles.includes('movements'),
        data.listOfFiles.includes('respect-rights'),
        data.listOfFiles.includes('respect-school'),
        data.listOfFiles.includes('cooperation'),
        data.listOfFiles.includes('independence'),
        data.listOfFiles.includes('completes-work'),
        data.listOfFiles.includes('effort'),
        data.listOfFiles.includes('organize'),
        data.listOfFiles.includes('participates'),
        data.listOfFiles.includes('positive'),
        data.listOfFiles.includes('quality'),
    ];
    //Push into sheet
    appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
    /*--------------------End Post to Sheets--------------------*/

    res.json({'error': false, 'link': tempFinalFilePath});
};

function getJwt() {
    let credentials = require("./credentials.json");
    console.log('Got credentials: ' + credentials.client_email);
    return new google.auth.JWT(
        credentials.client_email, null, credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
    );
}

function getApiKey() {
    let apiKeyFile = require("./api_key.json");
    console.log('Got API Key');
    return apiKeyFile.key;
}

function appendSheetRow(jwt, apiKey, spreadsheetId, range, row) {
    const sheets = google.sheets('v4');
    console.log('Appending row now');
    sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        auth: jwt,
        key: apiKey,
        valueInputOption: 'RAW',
        resource: {values: [row]}
    }).then(function(err, result) {
        if (err) {
            throw err;
        }
        else {
            console.log('Updated sheet: ' + result.data.updates.updatedRange);
        }
    }).catch(e => {
        console.log('Ignoring error thrown by sheets, through testing it did not actually fail to post');
    }) ;
}