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

const db = new Firestore({
	projectId: 'musicmarkdown',
	keyFilename: 'key.json'
});

function getSaveDataJSON(data) {
    let rawJSON;
    try {
        rawJSON = JSON.parse(data);

        if (typeof (rawJSON.data) != "string") {
            console.log("File data not valid");
            return null;
        }

        return {
            "data": rawJSON.data
        };
    } catch (e) {
        return null;
    }
}

function getFileDataJSON(rawJSON) {
    try {
        if (typeof (rawJSON.username) != "string") {
            console.log("Username not valid");
            return null;
        }

        if (typeof(rawJSON.fileName) != "string") {
            console.log("File name not valid");
            return null;
        }

        return {
            "username": rawJSON.username,
            "fileName": rawJSON.fileName
        }
    } catch (e) {
        return null;
    }
}

app.get('/login', async (req, res) => {
    // req.on('data', async)
    // const docRef = db.collection('users').doc('alovelace');

    // req.on('data', async function(data) {
    // 	// console.log(JSON.parse(data));
    // 	let body = JSON.parse(data);
    // 	console.log(body);

    // 	// await docRef.set(JSON.parse(data));
    // })
    // const queryObject = url.parse(req.url, true).query;
    // console.log(queryObject);
    // console.log((JSON.stringify(req.headers)))

    let body = req.query;
    let email = body['email'];
    let password = body['password'];

    let docRef = db.collection("users").doc(email);

    var getOptions = {
        source: 'server'
    };

    docRef.get(getOptions).then((doc) => {
        let data = doc.data();
        console.log('got data:', data.name);
        if (data.password === password) {
            res.writeHead(200);
            res.end('Username and password found');
        } else {
            res.writeHead(401);
            res.end('Invalid Username and Password');
        }
        return;
    }).catch((error) => {
        console.log('failed to get document', error);
        res.writeHead(401);
        res.end('Invalid Username and Password');
        return;
    });
    // console.log(email);
    // console.log(password)
    // console.log(body)

    // const snapshot = await db.collection('users').get();
    // snapshot.forEach((doc) => {
    // 	console.log(doc.id, '=>', doc.data());
    // });

    // res.writeHead(200);
    // res.end('Data saved!');
});


app.post('/save', async (req, res) => {
    let dataJSON = getFileDataJSON(req.query);

    if (dataJSON == null) {
        res.writeHead(400);
        console.log("Bad request");
        res.end("");
        return;
    }

    req.on('data', async data => {
        let saveDataJSON = getSaveDataJSON(data);

        if (saveDataJSON == null) {
            res.writeHead(400);
            console.log("Bad request");
            res.end("");
            return;
        }

        const docRef = db.collection('users').doc(dataJSON.username);

        try {
            let changes = {};
            changes['files.' + dataJSON.fileName] = saveDataJSON.data;
            await docRef.update(changes);
        } catch (e) {
            console.log("Error with update");
            res.writeHead(400);
            res.end("");
        }

        res.writeHead(200);
        res.end("");
    });
});


app.get('/getFile', async (req, res) => {
    let data = req.query;
    let dataJSON = getFileDataJSON(data);

    if (dataJSON == null) {
        res.writeHead(400);
        res.end("");
        console.log("Bad request");
        return;
    }

    // if they give empty file name, return list of file names
    if (dataJSON.fileName == "") {
        const doc = await db.collection('users').doc(dataJSON.username).get();
        let filesJSON = {
            "files": []
        };

        res.writeHead(200);

        if (doc.data() != undefined) {
            for (fileName in doc.data().files) {
                filesJSON.files.push(fileName);
            }
        }

        res.end(JSON.stringify(filesJSON));
    } else { // otherwise, return data from requested file
        let doc = await db.collection('users').doc(dataJSON.username).get();

        res.writeHead(200);

        if (doc.data() != undefined) {
            let fileList = doc.data().files;
            for (let fileName in fileList) {
                if (fileName == dataJSON.fileName) {
                    res.end(fileList[fileName]);
                    return;
                }
            }
        }

        res.end("");
    }
});

app.get('/createAccount', async (req, res) => {
    let body = req.query;
    let email = body['email'];
    let password = body['password'];
	console.log(body)
	console.log(email);
	console.log(password);

    let docRef = db.collection("users").doc(email);

    var getOptions = {
        source: 'server'
    };

	// var response; 
	// docRef.get(getOptions, async (response, error) => {
	// 	console.log(response);
	// 	console.log(error);
	// 	if (response) {
	// 		res.writeHead(401);
	// 		res.end('Username already exists');
	// 	}
	// 	if (error) {
	// 		docRef = db.collection("users");
	// 		console.log('password is', password)
	// 		docRef.doc(email).set({
	// 			password: password
	// 			// projects: {}
	// 		});
	// 		res.writeHead(200);
	// 		res.end("Successfully created account!");
	// 	}
	// });

	let success = false;
    await docRef.get(getOptions).then((doc) => {
        let data = doc.data();
        console.log(data.password)
        // if (data.password == password) {
		res.writeHead(401);
		res.end('Username already exists');
		// }
		// console.log('here for whatever reason');
        // } else {
        // 	res.writeHead(401);
        // 	res.end('Invalid Username and Password');
        // }
        return true;
    }).catch((error) => {
		success = true;
        console.log('Username and password does not exist in database');
		
    });
	if (success) {
		console.log(success)
		docRef = db.collection("users");
		console.log('password is', password)
		docRef.doc(email).set({
			password: password
			// projects: {}
		});
		res.writeHead(200);
		res.end("Successfully created account!");
	}
	
});

app.listen(port, () => {
    console.log("Server listening for requests.");
});
