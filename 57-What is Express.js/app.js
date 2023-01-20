//const http = require('http');
//this is no longer needed because of changes to how the server starts

const express = require('express');

const app = express();

/* 
//app.use is used when adding middleware
app.use((req, res, next) => {
	console.log('In the middleware!');
	next(); //Allows the request to continue to the next middleware in line
}); 
*/

/* app.use((req, res, next) => {
	console.log('In another the middleware!');
    //send response
    res.send('<h1>Hello from express!</h1>');
    //.send sets the header automaticaly, it can be overwritten by using res.setHeader()
}); */

//****HANDLING ROUTES*****
//this route and middleware runns for every app route
app.use('/', (req,res,next) =>{
    console.log('This always runs!');
    next(); //this makes sure that after this middleware the app continues further down the line
});


//because there is no next() being called in the middleware with path /add-product, when user visits this route the app sends this response and doesn't continue further down the line of app.use-es. That is also the reason why /add-products is above / . 
app.use('/add-product', (req, res, next) => {
	console.log('In another the middleware!');
	res.send('<h1>The "Add Product" page</h1>');
});

app.use('/', (req, res, next) => {
	console.log('In another the middleware!');
	res.send('<h1>Hello from express!</h1>');
});

// const server = http.createServer(app);
// server.listen(3000);

//shorter way of starting the server using express
app.listen(3000);
