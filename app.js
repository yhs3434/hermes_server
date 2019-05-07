const express = require('express');
const app = express();
const conn = require('./global/db.js');

app.get('/data/user/all', (req, res) => {
    conn.query('SELECT * FROM user', (err, rows, fields) => {
        if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
        } else {
            console.log('Error while performing Query.', err);
        }
    });
});

app.get('/data/user/:id', (req, res) => {
	conn.query('SELECT * FROM user WHERE id='+req.params.id, (err, rows, fields) => {
		if(!err) {
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

app.get('/data/hospital/all', (req, res) => {
	conn.query('SELECT * FROM hospital', (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

app.get('/data/hospital/:id', (req, res) => {
	conn.query('SELECT * FROM hospital WHERE id='+req.params.id, (err, rows, fields) => {
		if(err) {
			console.log('Error while performing Query.', err);
			return;
		}
		res_data = JSON.parse(JSON.stringify(rows));
		res.json(res_data);
	});
});
		

app.get('/data/records/all', (req, res) => {
	conn.query('SELECT * FROM records', (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

app.get('/data/records/:id', (req, res) => {
	conn.query('SELECT * FROM records WHERE id='+req.params.id, (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});
	

app.listen(3000, () => {
    console.log('start');
})
