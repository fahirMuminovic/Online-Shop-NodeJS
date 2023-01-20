const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));


//****HANDLING ROUTES*****
//because there is no next() being called in the middleware with path /add-product, when user visits this route the app sends this response and doesn't continue further down the line of app.use-es. That is also the reason why /add-products is above / . 
app.use('/add-product', (req, res, next) => {
	res.send(`
    <form action="/product" method="POST">
        <input type="text" name="title">
        <button type="submit">Add Product</button>
    </form>
    `);
});

app.use('/product', (req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
	//console.log('In another the middleware!');
	res.send('<h1>Hello from express!</h1>');
});

//shorter way of starting the server using express
app.listen(3000);
