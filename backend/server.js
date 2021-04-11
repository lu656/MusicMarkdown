/* Usage:
 * POST
 * {
 *  "username": username,
 *  "fileName": name of file to overwrite,
 *  "file": contents of the file as a string
 * }
 * RETURNS nothing
 * 
 * GET
 * {
 *  "username": username,
 *  "fileName": name of file to fetch
 * }
 * RETURNS
 * if fileName is empty:
 * {
 *  "files": list of filenames
 * }
 * otherwise:
 * {
 *  "fileName": name of file
 *  "data": contents of file as a string
 * }
 * 
 */

const Firestore = require('@google-cloud/firestore');

const express = require('express');
const app = express();
const port = 8080;
const server = http.createServer();

const db = new Firestore({
	projectId: 'musicmarkdown',
	keyFilename: 'key.json'
});

function getSaveDataJSON(data) {
    let rawJSON;
    try {
        rawJSON = JSON.parse(data);
        if (typeof(rawJSON.username) != "string") {
            return null;
        }

        if (typeof (rawJSON.fileName) != "string") {
            return null;
        }

        if (typeof (rawJSON.data) != "string") {
            return null;
        }

        return {
            "username": rawJSON.username,
            "fileName": rawJSON.fileName,
            "data": rawJSON.data
        };
    } catch (e) {
        return null;
    }
}

function getFileDataJSON(data) {
    let rawJSON;
    try {
        if (typeof (rawJSON.username) != "string") {
            return null;
        }

        if (typoef(rawJSON.fileName) != "string") {
            return null;
        }

        return {
            "username": rawJSON.username,
            "data": rawJSON.fileName
        }
    } catch (e) {
        return null;
    }
}

app.post('/save', (req, res) => {
    req.on('data', async function (data) {
        let dataJSON = getSaveDataJSON(data);

        if (dataJSON == null) {
            res.writeHead(400);
            console.log("Bad Request");
            return;
        }

        const docRef = db.collection('users/' + dataJSON.username).doc(dataJSON.fileName);
        let docJSON = {
            "data": dataJSON.data
        }
        console.log(dataJSON);
        await docRef.set(docJSON);

        res.writeHead(200);
    });
});


app.get('/getFile', (req, res) => {
    req.on('data', async function (data) {
        let dataJSON = getFileDataJSON(data);

        if (dataJSON == null) {
            res.writeHead(400);
            console.log("Bad request");
            return;
        }

        // if they give empty file name, return list of file names
        if (dataJSON.fileName == "") {
            const snapshot = await db.collection('users/' + dataJSON.username).get();
            let filesJSON = {
                "files": []
            };
            snapshot.forEach((file) => {
                filesJSON.files.append(file.id);
            });
            res.writeHead(200);
            res.end(filesJSON);
        } else { // otherwise, return data from requested file
            const snapshot = await db.collection('users/' + dataJSON.username).get();
            let fileJSON = {
                "fileName": data;
                "data": ""
            }
            snapshot.forEach((file) => {
                if (file.id == data) {
                    fileJSON.data = data.data();
                    return;
                }
            });

            res.writeHead(200);
            red.end(fileJSON);
        }
    });
});

app.listen(port, () => {
    console.log("Server listening for requests.");
});
