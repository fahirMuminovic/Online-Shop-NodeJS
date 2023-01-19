const http = require('http');
const routes = require('./routes');


//store the server address in variable named server
const server = http.createServer(routes);

//listen for incoming requests made to the server
server.listen(3000);


