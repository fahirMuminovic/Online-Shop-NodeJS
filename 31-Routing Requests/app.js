const http = require('http');
const fs = require('fs');

//this function runs for every request made to the server
/* function rqListener(req,res){
    //funtion body
}

http.createServer(rqListener); */
//the above code can be replaced by anonymous funcions like this:

//store the server address in variable named server
const server = http.createServer((req, res) => {
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
			fs.writeFileSync('message.txt', message);

			res.writeHead(302, { Location: '/' });
			return res.end();
		});
	}

	//node.js way of sending a response
	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>My First Server</title></head>');
	res.write('<h1>Hello from my Node.js Server!</h1>');
	res.write('</html>');
	res.end();
});

//listen for incoming requests made to the server
server.listen(3000);

//to stop a server we can use process.exit();
//process.exit();
