const http = require('http');

//this function runs for every request made to the server
/* function rqListener(req,res){
    //funtion body
}

http.createServer(rqListener); */
//the above code can be replaced by anonymous funcions like this:

//store the server address in variable named server
const server = http.createServer((req, res) => {
	//console.log(req);
	console.log(req.url, req.method, req.headers);

    //node.js way of sending a response
	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>My First Server</title></head>');
	res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
	res.write('</html>');
	res.end();
});

//listen for incoming requests made to the server
server.listen(3000);

//to stop a server we can use process.exit();
//process.exit();
