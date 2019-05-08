const express = require('express');
const router = express.Router();

const conn = require('../global/db.js');

router.get('/all', (req, res) => {
	conn.query('SELECT * FROM hospital', (err, rows, fields) => {
		if(!err){
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

router.get('/:id', (req, res) => {
	conn.query('SELECT * FROM hospital WHERE id='+req.params.id, (err, rows, fields) => {
		if(err) {
			console.log('Error while performing Query.', err);
			return;
		}
		res_data = JSON.parse(JSON.stringify(rows));
		res.json(res_data);
	});
});

router.post('/insert', (req, res) => {
	const h_name = req.body.name;
	const h_lat = req.body.lat;
	const h_lng = req.body.lng;
	const h_addr = req.body.addr;

	let query = "INSERT INTO hospital (name, lat, lng, addr) values (?, ?, ?);";
	let param = [h_name, h_lat, h_lng, h_addr];
	conn.query(query, param, (err, rows, fields) => {
		if(!err) {
			console.log('insert success');
			res_data = JSON.parse(JSON.stringify(rows));
			res.json(res_data);
		} else {
			console.log('Error while performing Query.', err);
		}
	});
});

module.exports = router;