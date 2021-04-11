const Firestore = require('@google-cloud/firestore');

const http = require('http');
const url = require('url');
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
server.on('request', createAccount);
server.listen(8080);
