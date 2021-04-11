const Firestore = require('@google-cloud/firestore');

const http = require('http');
const server = http.createServer();

const db = new Firestore({
	projectId: 'musicmarkdown',
	keyFilename: 'key.json'
});

async function handle(req, res) {
	const docRef = db.collection('users').doc('alovelace');

	req.on('data', async function(data) {
		console.log(JSON.parse(data));
		await docRef.set(JSON.parse(data));
	})

	const snapshot = await db.collection('users').get();
	snapshot.forEach((doc) => {
		console.log(doc.id, '=>', doc.data());
	});

	res.writeHead(200);
	res.end('Data saved!');
}

server.on('request', handle);
server.listen(8080);
