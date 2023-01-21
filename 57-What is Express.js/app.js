const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

//the order matters when we use router.use in the router files
//but if we use router.get or post or any other
//then express uses exact matching for the routes
app.use('/admin',adminRoutes);
app.use(shopRoutes);

//catch-all middleware
app.use((req,res,next)=>{
    res.status(404).send(`
    <h1>Page Not Found!</h1>
    `);
});

//shorter way of starting the server using express
app.listen(3000, ()=>{
    console.log('App started on http://localhost:3000');
});

