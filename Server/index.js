// https://gateway.pinata.cloud/ipfs/<metadata-hash-code>
// https://ipfs.io/ipfs/
const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const port = process.env.PORT || 5000;
const host = process.env.HOST || "http://localhost"
const pinataApiKey = process.env.PinataAPIKey || "5adab11187d1db68e561"
const pinataSecretApiKey = process.env.PinataSecretApiKey || "94c31305d30adffd8fb4eb29f4c5abfd1aade990d3dbf934169bd1a629ef787e"

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// Upload art to Pinata
function upload_art(art_url){
    console.log("start1");
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', fs.createReadStream(art_url)); // ./yourfile.png

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey1: 'exampleValue1',
            exampleKey2: 'exampleValue2'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        // cidVersion: 0,
        // customPinPolicy: {
        //     regions: [
        //         {
        //             id: 'FRA1',
        //             desiredReplicationCount: 1
        //         },
        //         {
        //             id: 'NYC1',
        //             desiredReplicationCount: 2
        //         }
        //     ]
        // }
    });
    data.append('pinataOptions', pinataOptions);

    return axios
        .post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        })
        .then(function (response) {
            //handle response here
            console.log("response");
            console.log(response.data)
        })
        .catch(function (error) {
            //handle error here
            console.log(error);
        });
}

// create a GET route
app.post('/mint', (req, res) => {
    upload_art("./server/arts/1.jpg")
    //res.json({ succees: true })
});