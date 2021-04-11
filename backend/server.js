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

async function handleLogin(req, res) {
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

    let body = JSON.parse(JSON.stringify(req.headers))
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
}

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

        const docRef = db.collection('users').doc(dataJSON.username);
        let fileName = dataJSON.fileName;
        let docJSON = {
            "data": dataJSON.data
        }
        console.log(dataJSON);
        await docRef.update({fileName: docJSON});

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
            const snapshot = await db.collection('users').doc(dataJSON.username).get();
            let filesJSON = {
                "files": []
            };
            snapshot.forEach((file) => {
                filesJSON.files.append(file.id);
            });
            res.writeHead(200);
            res.end(filesJSON);
        } else { // otherwise, return data from requested file
            const snapshot = await db.collection('users').doc(dataJSON.username).get();
            let fileJSON = {
                "fileName": data,
                "data": ""
            }
            snapshot.forEach((file) => {
                if (file.id == data) {
                    fileJSON.data = data.data();
                    return;
                }
            });

            res.writeHead(200);
            res.end(fileJSON);
        }
    });
});

async function createAccount(req, res) {
	let body = JSON.parse(JSON.stringify(req.headers))
	let email = body['email'];
	let password = body['password'];

	let docRef = db.collection("users").doc(email);

	var getOptions = {
		source: 'server'
	};

	docRef.get(getOptions).then((doc) => {
		let data = doc.data();
		console.log(data)
		// if (data.password === password) {
		res.writeHead(401);
		res.end('Username already exists');
		// } else {
		// 	res.writeHead(401);
		// 	res.end('Invalid Username and Password');
		// }
		return;
	}).catch((error) => {
		console.log('Username and password does not exist in database');
		docRef = db.collection("users");
		docRef.doc(email).set({
			password: password,
			projects: []
		});
		res.writeHead(200);
		res.end("Successfully created account!");
	});

}


// server.on('request', handleLogin);
// server.on('request', createAccount);
// server.listen(8080);
app.listen(port, () => {
    console.log("Server listening for requests.");
});
