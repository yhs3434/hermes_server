const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');
const async=require('async');

const user = require('./use_db/user.js');
const hospital = require('./use_db/hospital.js');
const records = require('./use_db/records.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', user);
app.use('/hospital', hospital);
app.use('/records', records);
app.use(express.static('public'));
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

app.get('/imgs', (req, res) => {
	fs.readFile('image.jpg', (err, data) => {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(data);
	});
});

app.listen(30001, () => {
    console.log('start');
})
