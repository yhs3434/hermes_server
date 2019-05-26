const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookie_parser = require('cookie-parser');
const fs = require('fs');


const user = require('./use_db/user.js');
const hospital = require('./use_db/hospital.js');
const records = require('./use_db/records.js');
const html_router = require('./router/html_router.js');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookie_parser());


app.use('/user', user);
app.use('/hospital', hospital);
app.use('/records', records);
app.use('', html_router);


app.get('/post', (req, res) => {
	fs.readFile('post.html', (err, data) => {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
	});
});
app.get('/login', (req, res) => {
	fs.readFile('login.html', (err, data) => {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
	});
});

app.get('/select', (req, res) => {
	fs.readFile('select.html', (err, data) => {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
	});
});

app.get('/imgs', (req, res) => {
	fs.readFile('image.jpg', (err, data) => {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
	});
});

app.listen(30001, () => {
    console.log('start');
})
