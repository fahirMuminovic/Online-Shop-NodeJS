const fs = require('fs');

//connect routes.js with app.js
const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/') {
		res.write('<html>');
		res.write('<head><title>Enter Message</title></head>');
		res.write(
			'<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
		);
		res.write('</html>');
		return res.end();
	}

	if (url === '/message' && method === 'POST') {
		const body = [];
		//data is sent in chunks
		req.on('data', (chunk) => {
			console.log(chunk);
			body.push(chunk);
		});
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			console.log(parsedBody);
			const message = parsedBody.split('=')[1];
			fs.writeFile('message.txt', message, (err) => {
				res.writeHead(302, { Location: '/' });
				return res.end();
			});
		});
	}

	//node.js way of sending a response
	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>My First Server</title></head>');
	res.write('<h1>Hello from my Node.js Server!</h1>');
	res.write('</html>');
	res.end();
};

module.exports = requestHandler;

/* Some other ways to export modules in node.js
module.exports = {
    handler: requestHandler,
    someText: 'Hard Coded Text'
}

module.exports.handler = requestHandler;
module.exports.someText = 'Hard Coded Text';

exports.handler = requestHandler;
exports.someText = 'Hard Coded Text';
*/
