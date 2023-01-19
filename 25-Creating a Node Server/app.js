const http = require('http');

//this function runs for every request made to the server
/* function rqListener(req,res){
    //funtion body
}

http.createServer(rqListener); */
//the above code can be replaced by anonymous funcions like this:

//store the server address in variable named server
const server = http.createServer((req, res) => {
    console.log(req);
});

//listen for incoming requests made to the server
server.listen(3000);
