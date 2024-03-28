const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
    console.log('request made');

    //set hearder content type
    res.setHeader('Content-Type', 'text/html');

    let path = './views/';

    if (req.url === '/') {
        path += 'index.html';
        res.statusCode = 200;
    } else if (req.url === '/admin') {
        path += 'admin.html'
        res.statusCode = 200;
    } else {
        path += '404.html';
        res.statusCode = 404;
    }

    //send an html page
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.end(data);
        }
    });
});

server.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000');
});