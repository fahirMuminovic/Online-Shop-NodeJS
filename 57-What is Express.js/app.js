//const http = require('http');
//this is no longer needed because of changes to how the server starts on line 25

const express = require('express');

const app = express();

//app.use is used when adding middleware
app.use((req, res, next) => {
	console.log('In the middleware!');
	next(); //Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
	console.log('In another the middleware!');
    //send response
    res.send('<h1>Hello from express!</h1>');
    //.send sets the header automaticaly, it can be overwritten by using res.setHeader()
});

// const server = http.createServer(app);
// server.listen(3000);

//shorter way of starting the server using express
app.listen(3000);